import _N from '@wonderlandlabs/n';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

import { Universe } from '@wonderlandlabs/universe';
import pixiStreamFactory from '../../pixiStreamFactory';
import { Vector2 } from '../../three/Vector2';

const SECTOR_DIVS = 40;
const white = chroma(255, 255, 255).num();
const red = chroma(255, 0, 0).num();
const blue = chroma(0, 0, 255).num();
const black = chroma(0, 0, 0).num();
const grey = chroma(102, 102, 102).num();

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
          if (subSector.galaxies) {
            g.beginFill(_.shuffle([red, white, blue]).pop());
          } else {
            g.beginFill(black);
            g.lineStyle(1 / stream.my.appScale, grey, 0.5);
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
      setTimeout(tryToLoadHighlighted, 100);
      return;
    }
    // we create a duplicate of sector to reduce the amount of long-term data storage

    const galaxySector = new Universe({ diameter: sector.diameter, galaxies });
    galaxySector.makeSubsectors(SECTOR_DIVS);
    galaxySector.distributeGalaxies();

    galStream.do.setSector(galaxySector);
    galStream.do.setGalaxies(galaxies);
    if (galStream.my.failedToInit) {
      galStream.do.initSector();
    }
  }

  tryToLoadHighlighted();
  return galStream;
};
