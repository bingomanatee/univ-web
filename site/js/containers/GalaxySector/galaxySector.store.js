import _N from '@wonderlandlabs/n';
import { Universe } from '@wonderlandlabs/universe';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';
import axios from 'axios';

import pixiStreamFactory from '../../pixiStreamFactory';
import { Vector2 } from '../../three/Vector2';
import apiRoot from '../../util/apiRoot';

const SECTOR_DIVS = 40;
const white = chroma(255, 255, 255).num();
const red = chroma(255, 0, 0).num();
const blue = chroma(0, 0, 255).num();
const black = chroma(0, 0, 0).num();
const green = chroma(0, 153, 0).num();
const yellow = chroma(153, 255, 0).num();
const grey = chroma(51, 102, 51).num();

export default ({ getSector, size }) => {
  const galStream = pixiStreamFactory({ size });
  galStream
    .addProp('availableDiameter', _.get(size, 'width', 1000) * 0.75)
    .addProp('appScale', 0.01, 'number')
    .addProp('sector')
    .addProp('sectorId')
    .addProp('galaxies')
    .addProp('centerGroup', new PIXI.Container())
    .addAction('updateCenterGroup', (stream) => {
      stream.do.scaleDiameter();
      stream.do.updateCenter();
      console.log('updating center group based on screen center', stream.my.screenCenter, 'ds:', stream.my.appScale);
      stream.my.centerGroup.position = stream.my.screenCenter;
      stream.my.centerGroup.scale = { x: stream.my.appScale, y: stream.my.appScale };
    })
    .addAction('drawHexes', (stream) => {
      console.log('draw hexes start');
      stream.do.updateCenterGroup();
      try {
        let g = new PIXI.Graphics();
        stream.my.centerGroup.removeChildren();
        stream.my.sector.forEach((subSector, i) => {
          if (subSector.galaxies < 1) {
            g.beginFill(black);
            g.lineStyle(1 / stream.my.appScale, grey, 0.5);
          } else if (subSector.galxies === 1) {
            g.beginFill(green);
          } else {
            g.beginFill(yellow);
          }
          const corners = subSector.corners(true).map((c) => c.round());
          if (!subSector.coord.x && !subSector.coord.y) {
            const xs = _(corners)
              .map('x')
              .uniq()
              .sortBy()
              .value();
            console.log('app scale', stream.my.appScale);
            console.log('corners range', _.max(xs) - _.min(xs));
            console.log(subSector.id, 'corner xs: ', ...xs);
            console.log('sector diameter:', stream.my.sector.diameter);
            console.log('sub sector diameter:', subSector.diameter);
            console.log('centerGroup:', stream.my.centerGroup);
          }
          g.moveTo(corners[0].x, corners[0].y);

          corners.forEach((c) => {
            g.lineTo(c.x, c.y);
          });
          g.endFill();

          if (i && (!(i % 20))) {
            stream.my.centerGroup.addChild(g);
            g = new PIXI.Graphics();
          }
        });

        stream.my.centerGroup.addChild(g);
      } catch (err) {
        console.log('error in drawHexes:', err);
      }
      console.log('draw hexes end');
    })
    .addProp('initialized', false, 'boolean')
    .addProp('failedToInit', false, 'boolean')
    .addProp('absCoord', null)
    .addAction('loadSubsectors', async (stream) => {
      const coord = stream.my.absCoord;
      if (!coord) {
        console.log('---- error: no absCoord');
        return;
      }

      const { x, y } = coord;
      const z = _N(x).plus(y).times(-1).value;
      const id = `x0y0z0.x${x}y${y}z${z}`;

      let subCoords = await axios.get(`${apiRoot()}/uni/${id}/_/divide`)
        .then(({ data }) => data);
      stream.my.sector.forEach((gSub) => {
        if (subCoords.length < 1) return;

        // find the subcoord with the same x and y coord -- should be none or one
        const matches = subCoords.filter((c) => c.x === gSub.x && c.y === gSub.y);

        if (matches.length) {
          // assign its galaxies
          gSub.galaxies = matches[0].g;
          // remove it from subCoords;
          subCoords = _.difference(subCoords, matches);
        }
      });
      console.log('loaded coords into sector');
      stream.do.drawHexes();
    })
    .addAction('initSector', (stream) => {
      console.log('initSector begun');
      if (!stream.my.sector) {
        console.log('no sector; delaying');
        stream.do.setFailedToInit(true);
        return;
      }
      try {
        const app = stream.get('app');
        app.stage.addChild(stream.my.centerGroup);
        stream.do.drawHexes();
        stream.do.setInitialized(true);
      } catch (err) {
        console.log('error in initUniverse', err.message);
      }

      console.log('initSector completed');
    })
    .addAction('sendSubsectors', (stream) => {
      console.log('deprecating client-push model of the universe');
      /*

      const sector = stream.my.sector;
   if (!sector) {
        console.log('sendSubsectors: -- no sector to send');
        return;
      }

      try {
        const sectors = [];
        sector.forEach((subsector) => {
          if (subsector.galaxies) {
            sectors.push({
              x: subsector.x,
              y: subsector.y,
              galaxies: subsector.galaxies,
            });
          }
        });

        const url = `${apiRoot()}/uni/${sector.absCoord.x},${sector.absCoord.y}/${sector.parent.id}`;

        console.log('sendSubsectors: -- sending', sectors, ' to ', url);
        axios.post(url, { sectors });
      } catch (err) {
        console.log('sendSubsectors: -- error:', err);
      } */
    })
    .addAction('scaleDiameter', (stream) => {
      try {
        const box = stream.my.sector.toBox(true);
        const boxSize = box.getSize(new Vector2());

        stream.do.setAppScale(
          _N(stream.my.width).div(boxSize.x)
            .min(_N(stream.my.height).div(boxSize.y))
            .times(0.9)
            .value,
        );
      } catch (err) {
        console.log('scaleDiameter error', err);
      }
    });

  galStream.on('initApp', () => galStream.do.initSector());
  galStream.on('resized', () => {
    if (galStream.my.initialized) {
      console.log('resized to ', galStream.my.width, 'x', galStream.my.height);
      galStream.do.drawHexes();
    }
  });

  function tryToLoadHighlighted() {
    console.log('trying to load highlighted');
    const highlighted = getSector();

    const sector = _.get(highlighted, 'sector', null);
    const galaxies = _.get(highlighted, 'galaxies', 0);

    if (!(sector)) {
      // race condition occasionally messes up retrieval of highlighted data
      setTimeout(tryToLoadHighlighted, 100);
      return;
    }
    // we create a duplicate of sector to reduce the amount of long-term data storage

    console.log('---- cloning -- ', sector.id);
    const galaxySector = new Universe({ parent: sector.parent.parent, diameter: sector.diameter, galaxies });
    console.log('--- from ', sector.coord.x, sector.coord.y);
    const scaled = new Vector2(sector.parent.coord.x * 10, sector.parent.coord.y * 10);
    console.log('--- and parent ', sector.parent.coord.x, sector.parent.coord.y, 'scaled to ', scaled);
    galaxySector.absCoord = new Vector2(sector.coord.x, sector.coord.y)
      .add(scaled);
    console.log('--- net result: ', galaxySector.absCoord);

    // generating subsectors in the client; will ultimately do this on the server.

    galaxySector.makeSubsectors(SECTOR_DIVS);
    galaxySector.forEach((s) => s.galaxies = 0);
    // galaxySector.distributeGalaxies();

    galStream.do.setAbsCoord(galaxySector.absCoord);
    galStream.do.setSector(galaxySector);
    galStream.do.setGalaxies(galaxies);
    galStream.do.loadSubsectors();
    if (galStream.my.failedToInit) {
      galStream.do.initSector();
    }
  }

  tryToLoadHighlighted();
  return galStream;
};
