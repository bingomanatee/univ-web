import { Hexes } from '@wonderlandlabs/hexagony';
import { Universe } from '@wonderlandlabs/universe';
import chroma from 'chroma-js';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import axios from 'axios';
import { Vector2 } from '../../three/Vector2';
import UnivSectorGroup from './UnivSectorGroup';
import rectInterset from './rectsIntersect';

export default (univStream) => {
  univStream
    .addProp('currentGalaxy')
    .addProp('zoomed', false, 'boolean')
    .addProp('controlsStream')
    .addAction('endZoom', (stream) => {
      stream.do.setZoomed(false);
    })
    .addAction('zoom', (stream) => {
      if (stream.my.controlsStream) {
        stream.my.controlsStream.do.setThrottle(0);
      }
      stream.do.setZoomed(true);
    });
};
