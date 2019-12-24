import React, { Component } from 'react';
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import is from 'is';

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
      .addProp('throttleTarget', 0, 'number')
      .addProp('offset', { x: 0, y: 0 })
      .addAction('updateOffset', (store) => {
        const move = 5 * store.my.throttle/3;
        const rad = (store.my.angle) * (Math.PI * 2) / 360;
        const { x, y } = store.my.offset;
        const xAdd = Math.cos(rad) * move;
        const yAdd = Math.sin(rad) * move;

        store.do.setOffset({ x: (x + xAdd), y: (y + yAdd) });
      })
      .addProp('stopTarget')
      .addProp('throttle', 0, 'number')
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
    if (this._bsPos) clearInterval(this._bsPos);
  }

  componentDidMount() {
    this._bsPos = setInterval(() => {
      this.store.do.updateOffset();
      this.props.setOffset(this.store.my.offset);
    }, 50);

    this._sub = this.store.filter('angle', 'targetAngle', 'throttle')
      .subscribe((state) => this.setState(state));
  }

  render() {
    const { angle, throttle } = this.state;
    console.log('rendering controls with ', angle, throttle);
    return (
      <>
        <div ref={this.controlsRef}>
          <ControlsView
            setDirection={(a) => {
              console.log('recieved dir ', a);
              // ui flaw in svg - numbers went wrong direction
              if (is.number(a)) this.store.do.setAngle(a);
              else {
                console.log('setDirection - bad value: ', a);
              }
            }}
            direction={angle}
            throttle={throttle}
            setThrottle={(n) => {
              console.log('setThrottle called with ', n);
              this.store.do.setThrottle(n);
            }}
          />
        </div>
      </>
    );
  }
}
