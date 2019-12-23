import { Hexes } from '@wonderlandlabs/hexagony';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import axios from 'axios';
import Hex from './Hex';

export default (stream) => {
  stream
    .addChild('universeGroup')
    .addChild('mouseHex')
    .addChild('hexMap', new Map())
    .addChild('hexagons', new Hexes({ scale: 50, pointy: true }))
    .addAction('initUniverse', (store) => {
      const ug = new PIXI.Container();
      const app = store.get('app');
      app.stage.addChild(ug);
      store.do.setUniverseGroup(ug);
      store.do.positionUG();
      store.do.drawHexes();
      console.log('init universe called');
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
    .addAction('loadGalaxyDensity', (store, center, range = 20) => {
      if (store.my.loadingGalaxy) {
        return;
      }
      const { x, y } = center || store.my.centerCoord;
      const url = `https://univ-2019.appspot.com/uni/${x},${y}/x0y0z0?range=${range}`;
      store.do.setLoadingGalaxy(true);
      axios.get(url)
        .then(({ data }) => {
          store.do.setLoadingGalaxy(false);
          if (Array.isArray(data)) {
            data.forEach(({ x, y, g }) => {
              store.my.galaxyMap.set(`${x},${y}`, g);
            });
            store.do.drawHexes();
          }
        })
        .catch((err) => {
          console.log('load error: ', err);
          store.do.setLoadingGalaxy(false);
        });
    })
    .addAction('drawHexes', async (store) => {
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
    })
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
      g.position = { x, y };
      store.do.drawHexes();
    })
    .addAction('reloadGalaxies', (store) => {
      const { x, y } = store.my.offset;
      const coord = store.my.hexagons.nearestHex(x, y);
      store.do.setCenterCoord(coord);
      store.do.loadGalaxyDensity();
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

  stream.do.loadGalaxyDensity();

  stream.on('initApp', () => stream.do.initUniverse());
  return stream;
};
