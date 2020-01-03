import { proppify } from '@wonderlandlabs/propper';
import _ from 'lodash';
import _N from '@wonderlandlabs/n';

import randomFor from '../../randomFor';
import galaxyColors from './galaxyColors';

const rand = randomFor('an entirely pseudo random');

const hexes = new Set();

class USGHex {
  constructor(sector, usg) {
    this.usg = usg;
    this.sector = sector;
    hexes.add(this);
    this.highlighted = false;
  }

  highlight() {
    hexes.forEach((h) => h._highlight = false);
    this._highlight = true;
    this.usg.highlightHex(this);
  }

  get corners() {
    return this.sector.corners().map((c) => c.clone());
  }

  randomPoint() {
    const [a, b] = rand.sample([...this.corners], 2);
    return a.clone().lerp(b.clone(), rand.real(0, 1, true)).round();
  }

  get center() {
    return this.sector.center;
  }

  initGalaxyCoords() {
    if (!this.sector.galaxies) {
      return;
    }

    this.sector.divide(5);

    const children = _.shuffle(this.sector.getChildren()).slice(0, (this.sector.galaxies));

    children.forEach((c) => {
      c.color = galaxyColors();
    });
  }

  get galaxies() {
    return this.sector.galaxies;
  }

  draw() {
    if (this.sector.galaxies <= 0) {
      return;
    }
    if (!this.galaxyCoords.length) {
      this.initGalaxyCoords();
    }
    this.sector.forEach((sub) => {
      if (sub.color) {
        this.usg.graphics.beginFill(sub.color, 0.125);
        this.usg.graphics.drawRect(sub.center.x - sub.diameter, sub.center.y - sub.diameter,
          sub.diameter * 2, sub.diameter * 2);
        this.usg.graphics.endFill();
        this.usg.graphics.beginFill(sub.color, 0.125);
        this.usg.graphics.drawRect(sub.center.x - sub.diameter / 2, sub.center.y - sub.diameter / 2,
          sub.diameter, sub.diameter);
        this.usg.graphics.endFill();
        this.usg.graphics.beginFill(sub.color, 0.25);
        this.usg.graphics.drawRect(sub.center.x - sub.diameter / 4, sub.center.y - sub.diameter / 4,
          sub.diameter / 2, sub.diameter / 2);
        this.usg.graphics.endFill();
      }
    });
  }
}

proppify(USGHex)
  .addProp('galaxyCoords', [], 'array')
  .addProp('usg')
  .addProp('sector');

export default USGHex;
