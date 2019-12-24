import chroma from 'chroma-js';
import _ from 'lodash';
import _N from '@wonderlandlabs/n';

import * as PIXI from 'pixi.js';
import axios from 'axios';
import randomFor from '../../randomFor';
import galaxyColors from './galaxyColors';
import USGHex from './USGHex';

const FADE_DURATION = 1800;
const white = chroma(255, 255, 255).num();
const darkGrey = chroma(102, 102, 102).num();
const black = chroma(0, 0, 0).num();

/**
 * Hex is a galaxy sized chunk of space. It is the top-level entity in
 * Hexagon.
 */

export default class Hex {
  constructor({ sector, store }) {
    this.sector = sector;
    this.store = store;
    this.color = darkGrey;
    this._active = false;
    this.loadStatus = 'not loaded';
    this._ssMap = new Map();
  }

  get active() {
    return this._active;
  }

  set active(b) {
    if (b === this._active) return;
    this._active = b;
    if (b) {
      if (this.loadStatus === 'loaded') {
        this.draw();
      } else this.load();
    } else if (this._active) {
      this.detach();
    }
  }

  load() {
    if (this.loadStatus !== 'not loaded') {
      return;
    }
    let { x, y } = this.sector.coord;
    x *= 10;
    y *= 10;

    this.loadStatus = 'loading';
    const url = `https://univ-2019.appspot.com/uni/${x},${y}/x0y0z0?range=7`;
    axios.get(url)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          this.sector.divide(5);
          this.sector.forEach(s =>s.galaxies = 0);
          data.forEach((datum) => {
            const datumID = `${datum.x},${datum.y}`;
            if (this.store.my.datumClaims.has(datumID)) {
              // some sectors share sub-hexes at their borders
              const parentId = this.store.my.datumClaims.get(datumID);
              if (parentId !== this.sector.id) {
                // another sector has claimed the subhex; don't try to use this datum.
                return;
              }
            }
            const localX = datum.x - x;
            const localY = datum.y - y;

            let match = false;
            // @TODO: faster retrival by index lookup
            this.sector.forEach((sub) => {
              if (match) {
                return;
              }
              if (sub.x === localX && sub.y === localY) {
                match = sub;
              }
            });

            if (match) {
              match.galaxies = datum.g;
              match.datum = datum;
              this.store.my.datumClaims.set(datumID, this.sector.id);
            }
          });
          this.loadStatus = 'loaded';
          this._text.text = this.id;
          this.draw();
        } else {
          this.loadStatus = 'error';
          console.log('error loading', x, y, 'data = ', data);
        }
      })
      .catch((err) => {
        console.log('load error: ', err);
        if (this.loadStatus === 'retrying') return;
        this.loadStatus = 'retrying';
        setTimeout(() => this.load(), 500);
      });
  }

  detach() {
    console.log('detaching', this.id);
    this.draw();
  }

  get id() {
    return this.sector.id;
  }

  get first() {
    return this.corners[0];
  }

  hexLine() {
    this.graphics.moveTo(this.first.x, this.first.y);
    this.corners.slice(1).forEach(({ x, y }) => this.graphics.lineTo(x, y));
  }

  ssHexLine(sector) {
    const first = sector.corners()[0];
    this.graphics.moveTo(first.x, first.y);
    sector.corners().slice(1).forEach(({ x, y }) => this.graphics.lineTo(x, y));
  }

  get corners() {
    return this.sector.corners().map((c) => c.clone());
  }

  drawBack() {
    this.graphics.clear()
      .beginFill(this.color);
    this.hexLine();
    this.graphics.endFill();
  }

  ssColor(subSector) {
    const c = _N(subSector.galaxies).clamp(0, 255).value;
    return chroma(c, c, c).num();
  }

  drawSubsectors() {
    this.graphics.clear();
    this.sector.forEach((subSector) => {
      /* this.graphics.beginFill(this.ssColor(subSector));
      this.ssHexLine(subSector);
      this.graphics.endFill(); */
      if (!this._ssMap.has(subSector.id)) {
        this._ssMap.set(subSector.id, new USGHex(subSector, this));
      }
      this._ssMap.get(subSector.id).draw();
    });
  }

  get graphics() {
    if (!this._graphics) {
      this._graphics = new PIXI.Graphics();
    }

    return this._graphics;
  }

  getLabel() {
    if (this._text) return this._text;
    this._text = new PIXI.Text(`loading sector ${this.id} ...`, {
      fontFamily: 'Helvetica,sans-serf', fill: white, fontSize: 24, align: 'center',
    });
    this._text.position = this.sector.center;
    return this._text;
  }

  labelDatums() {
    const { labelGroup } = this.store.my;
    this.sector.forEach((sub) => {
      if (sub.datum) {
        const text = new PIXI.Text(`${sub.datum.x},${sub.datum.y}`, {
          fontFamily: 'Helvetica,sans-serif', fill: 'grey', fontSize: 16, align: 'center',
        });

        let { x, y } = sub.center;
        x *= this.store.my.universeDrawScale;
        y *= this.store.my.universeDrawScale;
        text.position = { x, y };

        this.store.my.labelGroup.addChild(text);
      }
    });
  }

  draw() {
    if (this.active && this.loadStatus === 'loaded') {
      this.drawSubsectors();
      // this.labelDatums();
    } else {
      this.drawBack();
    }
  }
}
