import { Hexes } from '@wonderlandlabs/hexagony';
import { Universe } from '@wonderlandlabs/universe';

import * as PIXI from 'pixi.js';
import _ from 'lodash';
import axios from 'axios';
import Hex from './Hex';
import UnivSectorGroup from './UnivSectorGroup';
import rectInterset from './rectsIntersect';

const universe = new Universe({});
universe.divide(30);

console.log('universe box: ', universe.toBox());

const universeDrawScale = 100000 / universe.diameter;

export default (stream) => {
  stream
    .addChild('universeGroup', new PIXI.Container())
    .addChild('mouseHex')
    .addProp('universe', universe)
    .addChild('hexMap', new Map())
    .addChild('metaSectors', new Map())
    .addChild('hexagons', new Hexes({ scale: 50, pointy: true }))
    .addProp('labelGroup', new PIXI.Container())
    .addProp('universeDrawScale', universeDrawScale)
    .addAction('initUniverse', (store) => {
      console.log('initUniverse begun');
      try {
        store.my.universeGroup.scale = { x: universeDrawScale, y: universeDrawScale };
        const app = store.get('app');
        app.stage.addChild(store.my.universeGroup);
        app.stage.addChild(store.my.labelGroup);
        store.my.universe.forEach((sector) => {
          const univSectorGroup = new UnivSectorGroup({ sector, store });
          store.my.metaSectors.set(univSectorGroup.id, univSectorGroup);
        });
        store.do.positionUG();
        setTimeout(() => {
          store.do.drawHexes();
        }, 500);
      } catch (err) {
        console.log('error in initUniverse', err.message);
      }

      store.do.drawSectors();
      console.log('initUniverse completed');
    })
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
    .addSubStream('currentGalaxy', null)
    .addAction('updateCurrentGalaxy', (store, secondTry) => {
      const hexMap = store.get('hexMap');
      const name = store.get('currentGalaxyName');
      if (!name) {
        return;
      }
      console.log('looking for galaxy ', name);
      if (hexMap.has(name)) {
        store.do.setCurrentGalaxy(hexMap.get(name));
        console.log('choosing current galaxy ', hexMap.get(name));
      } else if (!secondTry) {
        setTimeout(() => {
          stream.do.updateCurrentGalaxy(true);
        }, 1000);
      }
    })
    .addProp('offset', { x: 0, y: 0 })
    .addProp('galaxyMap', new Map())
    .addProp('centerCoord', { x: 0, y: 0 })
    .addAction('tryToGetFrom', (store, center) => {
      console.log('trying to load near ', center);
      if (store.my.loadingGalaxy) {
        return;
      }
      store.do.loadGalaxyDensity(center, 5);
    })
    .addProp('loadingGalaxy', false)
    .addAction('drawHexes', async (store) => {
      const screenRect = new PIXI.Rectangle(0, 0,
        store.my.width, store.my.height);

      store.my.metaSectors.forEach((usg) => {
        const bounds = usg.graphics.getBounds();
        if (!bounds.width) return;
        usg.active = rectInterset(bounds, screenRect);
      });
    })
  /*    .addAction('drawHexes', async (store) => {
      const {
        hexagons, universeGroup, width, height, hexMap,
      } = store.my;

      const { x, y } = store.my.offset;

      const hexes = hexagons.floodRect(width / -2 + x, height / -2 + y, width / 2 + x, height / 2 + y, true);

      hexes.forEach((coord) => {
        let hex = new Hex(coord, hexagons, store);
        if (hexMap.has(hex.id)) {
          hex = hexMap.get(hex.id);
        } else {
          console.log('adding hex ', hex.id);
          hexMap.set(hex.id, hex);

          hex.drawBack();
          hex.g.on('mouseover', () => {
            console.log('mouse over on ', hex.id);
            hex.drawOver();
          });
          hex.g.on('mouseout', () => hex.fade());

          if (!store.my.loadingGalaxy) {
            store.do.tryToGetFrom(hex.coord);
          }

          universeGroup.addChild(hex.g);
          hex.draw();
        }
      });
      store.do.setMouseHex(null);
    }) */
    .addAction('tryToLoadGalaxyFromName', (store) => {
      store.do.updateCurrentGalaxy();
    })
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
    .addAction('positionUG', (store) => {
      const g = store.my.universeGroup;
      if (!g) return;

      const x = store.my.width / 2 - store.my.offset.x;
      const y = store.my.height / 2 - store.my.offset.y;
      store.my.universeGroup.position = { x, y };
      store.my.labelGroup.position = { x, y };
      store.do.drawHexes();
    })
    .addAction('reloadGalaxies', (store) => {
      const { x, y } = store.my.offset;
      const coord = store.my.hexagons.nearestHex(x, y);
      store.do.setCenterCoord(coord);
    })
    .addAction('restartHex', (store) => {
      const ug = store.get('universeGroup');
      const hexMap = store.get('hexMap');
      hexMap.clear();
      store.do.setMouseHex(null);
      ug.interactiveChildren = true;
      ug.removeChildren();

      store.do.drawHexes();
    });

  stream.watch('size', 'positionUG');
  stream.watch('offset', (values) => {
    if ((values.value.x !== values.was.x) || (values.value.y !== values.was.y)) {
      stream.do.positionUG();
    }
  });

  stream.on('initApp', () => stream.do.initUniverse());
  return stream;
};
