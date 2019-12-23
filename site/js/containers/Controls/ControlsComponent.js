import React, { Component } from 'react';
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';

import { Stack } from 'grommet';
import { SVG } from '@svgdotjs/svg.js';
import ControlsView from './ControlsView';
import DirectionIndicator from './DirectionIndicator';
import ThrottleIndicator from './ThrottleIndicator';

const DISC_SIZE = 285;
const DISC_Y = 157;
const DISC_X = 286;

const THROTTLE_MIN_Y = 41;
const THROTTLE_HEIGHT = 240;
const THROTTLE_UNIT = 12;

const C = 15;

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.controlsRef = React.createRef();
    this.diRef = React.createRef();
    this.throttleRef = React.createRef();

    this.store = new ValueStream('controls')
      .addProp('angle', 0, 'number')
      .addProp('targetAngle', 0, 'number')
      .addAction('enableDiscClick', (store) => {
        const { disc } = store.my;
        const discSVG = SVG(disc);
        discSVG.click((e) => {
          console.log('disc click', e);
          const { layerX, layerY } = e;

          const x = layerX - DISC_X;
          const y = layerY - DISC_Y;

          let angle = (Math.atan2(y, x) * (360 / (Math.PI * 2)));

          _.range(-360, 450, 90)
            .forEach((target) => {
              if (_.clamp(angle, target - C, target + C) === angle) {
                angle = target;
              }
            });

          angle -= (angle % 15);

          store.do.setTargetAngle(angle + 90);
          store.do.moveToTargetAngle();
        });
      })
      .addProp('throttleTarget')
      .addProp('offset', { x: 0, y: 0 })
      .addAction('updateOffset', (store) => {
        const move = 5 * store.my.throttle / THROTTLE_HEIGHT;
        const rad = (store.my.angle - 90) * (Math.PI * 2) / 360;
        const { x, y } = store.my.offset;
        if (!rad) return;
        const xAdd = Math.cos(rad) * move;
        const yAdd = Math.sin(rad) * move;

        store.do.setOffset({ x: (x + xAdd), y: (y + yAdd) });
      })
      .addProp('stopTarget')
      .addProp('throttle', 0, 'number')
      .addAction('enableThrottleClick', (store) => {
        const { throttleTarget, stopTarget } = store.my;
        const throttleSVG = SVG(throttleTarget);
        throttleSVG.click((e) => {
          const { layerY } = e;

          const y = layerY - THROTTLE_MIN_Y;
          store.do.setThrottle(Math.round(y / THROTTLE_UNIT) * THROTTLE_UNIT);
        });
        SVG(stopTarget).click(() => {
          store.do.setThrottle(0);
        });
      })
      .addProp('angleVelocity', 0, 'number')
      .addAction('moveToTargetAngle', (store) => {
        let { angle, angleVelocity } = store.my;

        let delta = (angle - store.my.targetAngle) % 360;
        if (Math.abs(delta) < 1 && angleVelocity < 1) {
          store.do.setAngle(store.my.targetAngle);
          store.do.setAngleVelocity(0);
          return;
        }
        if (delta > 180) {
          delta -= 360;
        } else if (delta < -180) {
          delta += 360;
        }
        if (delta > 0) {
          if (delta > 20) {
            angleVelocity -= 4;
          } else if (delta > 10) {
            angleVelocity -= 2;
          } else {
            angleVelocity -= 1;
          }
        } else if (delta < 0) {
          if (delta < -20) {
            angleVelocity += 4;
          } else if (delta < -10) {
            angleVelocity += 2;
          } else {
            angleVelocity += 1;
          }
        }

        angle += angleVelocity;

        store.do.setAngle(angle);
        store.do.setAngleVelocity(angleVelocity * 0.8);

        if (angleVelocity || (angle !== store.my.targetAngle)) {
          setTimeout(store.do.moveToTargetAngle, 100);
        }
      })
      .addProp('directionIndicator')
      .addProp('disc');

    this.state = { ...this.store.state };
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  componentDidMount() {
    const diEle = this.diRef.current;
    this.store.do.setDirectionIndicator(diEle);

    const cEle = this.controlsRef.current;

    const disc = cEle.querySelector('#disc');

    const throttleTarget = cEle.querySelector('#throttle-target');
    const stopTarget = cEle.querySelector('#throttle-stop');

    this.store.do.setDisc(disc);
    this.store.do.enableDiscClick();

    this.store.do.setThrottleTarget(throttleTarget);
    this.store.do.setStopTarget(stopTarget);
    this.store.do.enableThrottleClick();

    const broadcastPos = setInterval(() => {
      this.store.do.updateOffset();
      this.props.setOffset(this.store.my.offset);
    }, 50);

    this._sub = this.store.filter('angle', 'throttle')
      .subscribe((update) => {
        this.setState(update);
      }, (err) => { console.log('control error: ', err); }, () => clearInterval(broadcastPos));
  }

  render() {
    const { angle, throttle } = this.state;
    return (
      <>
        <div ref={this.controlsRef}>
          <ControlsView />
        </div>
        <div
          style={({
            position: 'absolute',
            left: 257,
            top: 120,
            transform: `rotate(${angle}deg)`,
          })}
          ref={this.diRef}
        >
          <DirectionIndicator />
        </div>
        <div
          style={({
            position: 'absolute',
            left: 20,
            top: 35 + throttle,
          })}
          ref={this.throttleRef}
        >
          <ThrottleIndicator />
        </div>
      </>
    );
  }
}
