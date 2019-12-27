import { Hexes } from '@wonderlandlabs/hexagony';
import { Universe } from '@wonderlandlabs/universe';
import chroma from 'chroma-js';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import axios from 'axios';
import { Vector2 } from '../../three/Vector2';
import UnivSectorGroup from './UnivSectorGroup';
import rectInterset from './rectsIntersect';

const universe = new Universe({});
universe.divide(30);

const universeDrawScale = 50000 / universe.diameter;
const grey = chroma(128, 128, 128).num();

export default (stream) => {
  stream
    .addProp('hexMap', new Map())
    .addProp('datumClaims', new Map())
    .addProp('metaSectors', new Map())
    .addProp('universeGroup', new PIXI.Container())
    .addProp('labelGroup', new PIXI.Container())
    .addProp('highlightGroup', new PIXI.Container())
    .addProp('offsetGroup', new PIXI.Container())
    .addProp('universe', universe)
    .addProp('universeDrawScale', universeDrawScale)
    .addAction('initUniverse', (store) => {
      console.log('initUniverse begun');
      try {
        store.my.offsetGroup.scale = { x: universeDrawScale, y: universeDrawScale };
        store.do.updateCenter();
        store.my.offsetGroup.addChild(store.my.universeGroup);
        store.my.offsetGroup.addChild(store.my.highlightGroup);
        const app = store.get('app');
        app.stage.addChild(store.my.offsetGroup);
        app.stage.addChild(store.my.labelGroup); // labelGroup is not scaled - because it has text
        // it cannot be scaled to the gargantuan scale offset of the universe
        store.my.universe.forEach((sector) => {
          const univSectorGroup = new UnivSectorGroup({ sector, store });
          store.my.metaSectors.set(univSectorGroup.id, univSectorGroup);
        });
        store.do.positionUG();
        setTimeout(store.do.drawHexes, 500);
      } catch (err) {
        console.log('error in initUniverse', err.message);
      }

      store.do.drawSectors();
      console.log('initUniverse completed');
    })
    .addProp('offset', new Vector2(0, 0))
    .addProp('centerUSGHex', null)
    .addProp('highlightedHex', null)
    .addAction('drawSectors', (store) => {
      try {
        store.my.metaSectors.forEach((usg) => {
          usg.draw();
          store.my.universeGroup.addChild(usg.graphics);
        });
        store.my.metaSectors.forEach((usg) => {
          const label = usg.getLabel();
          let { x, y } = usg.sector.center;
          x *= universeDrawScale;
          y *= universeDrawScale;
          label.position = { x, y };

          store.my.labelGroup.addChild(label);
        });
      } catch (err) {
        console.log('drawSectors error:', err.message);
      }
    })
    .addAction('drawHexes', async (store) => {
      const screenRect = new PIXI.Rectangle(0, 0,
        store.my.width, store.my.height);

      store.my.metaSectors.forEach((usg) => {
        const bounds = usg.graphics.getBounds();
        if (!bounds.width) return;
        usg.active = rectInterset(bounds, screenRect);
      });
    })
    .addAction('highlightHex', (store, h) => {
      if (h === store.my.highlightedHex) return;
      store.do.setHighlightedHex(h);

      store.my.highlightGroup.removeChildren();
      if (h) {
        const g = new PIXI.Graphics();
        const corners = h.sector.corners();
        g.alpha = 0.2;
        g.beginFill(grey)
          .moveTo(corners[0].x, corners[0].y);

        corners.forEach(({ x, y }) => {
          g.lineTo(x, y);
        });
        g.endFill();

        store.my.highlightGroup.addChild(g);
      }
    })
    .addAction('selectCenterHex', (store) => {
      const scrollOffset = store.my.offset.clone()
        .multiplyScalar(1 / universeDrawScale);

      function sectorCenter(sector) {
        const center = new Vector2(sector.center.x, sector.center.y);
        return center;
      }

      function getNearestCenter(univ) {
        let nearest = null;
        if (!univ) return null;
        if (!univ.forEach) {
          console.log('cannot iterate over: ', univ);
          return null;
        }
        univ.forEach((sector) => {
          if (!nearest || (sectorCenter(sector).distanceToSquared(scrollOffset)
            < sectorCenter(nearest).distanceToSquared(scrollOffset))) {
            nearest = sector;
          }
        });

        return nearest;
      }
      const sectors = Array.from(store.my.metaSectors.values())
        .filter((s) => s.active);

      const nearestUSG = getNearestCenter(sectors);
      if (!nearestUSG) return;
      const subSectors = Array.from(nearestUSG.usgHexes.values());

      const nearestSub = getNearestCenter(subSectors);
      if (nearestSub) {
        nearestSub.highlight();
      }
    })
    .addAction('positionUG', (store) => {
      const g = store.my.universeGroup;
      if (!g) return;

      try {
        const position = store.my.screenCenter.clone()
          .sub(store.my.offset);

        store.my.offsetGroup.position = position.clone();
        store.my.labelGroup.position = position.clone();
        store.do.selectCenterHex();
        store.do.drawHexes();
      } catch (error) {
        console.log('error in positioningUG: ', error);
      }
    })

    // -- deprecated
    .addProp('mouseHex')
    .addProp('hexagons', new Hexes({ scale: 50, pointy: true }))
    .addAction('updateHex', (store) => {
      const x = store.get('x');
      const y = store.get('y');
      const matrix = store.get('hexagons');
      const hexMap = store.get('hexMap');
      const mouseHex = store.get('mouseHex');

      const nearestCoord = matrix.nearestHex(x, y);
      const id = nearestCoord.toString();
      const nearHex = hexMap.get(id);

      if (nearHex !== mouseHex) {
        if (mouseHex) mouseHex.drawOut();
        if (nearHex) {
          nearHex.drawOver();
        }
        store.do.setMouseHex(nearHex);
      }
    })
    .addAction('reloadGalaxies', (store) => {
      const { x, y } = store.my.offset;
      const coord = store.my.hexagons.nearestHex(x, y);
      store.do.setCenterCoord(coord);
    })
    .addAction('restartHex', (store) => {
      const ug = store.my.universeGroup;
      const hexMap = store.my.hexMap;
      hexMap.clear();
      store.do.setMouseHex(null);
      ug.interactiveChildren = true;
      ug.removeChildren();

      store.do.drawHexes();
    });

  stream.watch('size', 'positionUG');
  stream.watch('centerUSGHex', ({ value }) => {
    console.log('centerUSGHex changed to ', value.sector.id,
      'x',
      value.sector.center.x,
      'y',
      value.sector.center.y);
  });
  stream.watch('screenCenter', ({ value }) => {
    console.log('screenCenter changed to ',
      'x',
      value.x,
      'y',
      value.y);
    stream.do.selectCenterHex();
  });
  stream.watch('offset', (values) => {
    if ((values.value.x !== values.was.x) || (values.value.y !== values.was.y)) {
      stream.do.positionUG();
    }
  });

  stream.on('initApp', () => stream.do.initUniverse());
  // the accuracy of the center cursor readouts depend on loading
  // the sector data; this is lazy admittedly.
  setTimeout(
    stream.do.selectCenterHex,
    2000,
  );
  setTimeout(
    stream.do.selectCenterHex,
    6000,
  );
  return stream;
};
