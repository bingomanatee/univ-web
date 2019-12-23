import chroma from 'chroma-js';
import _ from 'lodash';
import _N from '@wonderlandlabs/n';
import tg from 'tinygradient';

import * as PIXI from 'pixi.js';
import randomFor from '../../randomFor';

const FADE_DURATION = 1800;
const white = chroma(255, 255, 255).num();

/**
 * Hex is a galaxy sized chunk of space. It is the top-level entity in
 * Hexagon.
 */

const colorGrad = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(255,153,153)', pos: 0.333 },
  { color: 'rgb(153,153,255)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);
const colorGrad2 = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(255,51,51)', pos: 0.333 },
  { color: 'rgb(51,51,255)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);
const colorGrad3 = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(128,0,0)', pos: 0.333 },
  { color: 'rgb(0,0,128)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);

const rand = randomFor('an entirely pseudo random');
const randColor = () => {
  const grad = rand.pick([colorGrad, colorGrad2, colorGrad3]);
  const tc = grad.rgbAt(rand.real(0, 1)).toRgb();
  return chroma(tc.r, tc.g, tc.b).num();
};

export default class Hex {
  constructor(coord, matrix, store) {
    this.coord = coord;
    this.matrix = matrix;
    this._pColor = chroma(255, _.random(0, 255), 0).num();
    this.store = store;

    this._sectors = [];
  }

  randomPoint() {
    const [a, b] = rand.sample([...this.corners], 2);
    return a.clone().lerp(b, rand.real(0, 1, true));
  }

  get galaxyCoords() {
    if (this.galaxies === -1) return [];
    if (!this._galaxyCoords) {
      this._galaxyCoords = [];

      let remainingGalaxies = this.galaxies;

      while (remainingGalaxies > 0) {
        const point = this.randomPoint();
        let radius = rand.integer(1, Math.min(Math.min(4, Math.sqrt(remainingGalaxies)), remainingGalaxies));
        radius = Math.max(2, radius);
        remainingGalaxies -= radius;
        const color = randColor();
        this._galaxyCoords.push({ point, radius, color });
      }
    }

    return this._galaxyCoords;
  }

  linkToSectorStream(ss) {
    this.sectorStream = ss;
    ss.do.setGalaxy(this);
  }

  get sectors() {
    return this._sectors;
  }

  set sectors(value) {
    this._sectors = value;
  }

  get g() {
    if (!this._g) {
      this._g = new PIXI.Graphics();
      this._g.interactive = true;
      this._g.interactiveChildren = true;
    }
    return this._g;
  }

  get corners() {
    if (!this._corners) {
      this._corners = this.matrix.corners(this.coord);
    }
    return this._corners;
  }

  get first() {
    return this.corners[0];
  }

  hexLine() {
    this.g.moveTo(this.first.x, this.first.y);
    this.corners.slice(1).forEach(({ x, y }) => this.g.lineTo(x, y));
  }

  get id() {
    return `${this.coord.x},${this.coord.y}`;
  }

  get galaxies() {
    const cMap = this.store.my.galaxyMap;
    if (cMap && cMap.has(this.id)) {
      return cMap.get(this.id);
    }
    this.store.do.tryToGetFrom(this.coord);

    return -1;
  }

  drawGalaxyDots() {
    this.galaxyCoords.forEach(({ point, radius, color }) => {
      this.g.beginFill(color)
        .drawCircle(point.x, point.y, radius)
        .endFill();
    });
  }

  get color() {
    if (!this._color) {
      const c = _N(this.galaxies).clamp(0, 255).round().value;
      this._color = chroma(c, c, c).num();
      return this._color;
    }
    return this._color;
  }

  drawOver() {
    const { g } = this;
    try {
      g.clear();
      g.beginFill(white);
      this.hexLine();
      g.endFill();
      this.over = true;
      this.fading = false;
    } catch (err) {
      console.log('drawOver error:', err, this);
    }
    g.calculateBounds();
  }

  fade() {
    if (this.over) {
      this.fading = Date.now();
      this.over = false;
      this.drawOut();
    }
  }

  drawBack() {
    const { g } = this;
    g.clear();
    g.beginFill(this.color);
    this.hexLine();
    g.endFill();
  }

  drawOut() {
    if (this.over) {
      return;
    }
    const { g } = this;
    try {
      if (!this.fading) {
        this.drawBack();
        this.drawGalaxyDots();

        g.lineStyle(1, 0, 0.1, 0.5, false);
        this.hexLine();
      } else {
        const elapsed = Date.now() - this.fading;

        if (elapsed > FADE_DURATION) {
          this.fading = false;
          this.drawOut();
        } else {
          this.drawBack();
          this.drawGalaxyDots();

          const c = _N(FADE_DURATION).sub(elapsed).div(FADE_DURATION)
            .pow(2)
            .times(255)
            .clamp(0, 255)
            .round().value;
          g.lineStyle(4, chroma(c, c, c).num(), 0.1, 0.5, false);
          this.hexLine();
          setTimeout(() => this.drawOut(), 5);
        }
      }
    } catch (err) {
      console.log('drawOut error:', err, this);
    }
    g.calculateBounds();
  }

  draw() {
    if (this.over) {
      this.drawOver();
    } else {
      this.drawOut();
    }
  }
}
