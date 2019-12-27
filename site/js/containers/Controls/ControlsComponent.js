import React, { Component } from 'react';
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import is from 'is';

import { Stack } from 'grommet';
import { SVG } from '@svgdotjs/svg.js';
import { Vector2 } from '../../three/Vector2';
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

    this.stream = new ValueStream('controls')
      .addProp('angle', 0, 'number')
      .addProp('targetAngle', 0, 'number')
      .addProp('throttleTarget', 0, 'number')
      .addProp('offset', new Vector2(0, 0))
      .addAction('updateOffset', (stream) => {
        const move = (5 * stream.my.throttle) / 3;
        const rad = (stream.my.angle * Math.PI * 2) / 360;
        const xAdd = Math.cos(rad) * move;
        const yAdd = Math.sin(rad) * move;

        stream.do.setOffset(stream.my.offset.clone().add(new Vector2(xAdd, yAdd)));
      })
      .addProp('stopTarget')
      .addProp('throttle', 0, 'number')
      .addProp('angleVelocity', 0, 'number')
      .addAction('moveToTargetAngle', (stream) => {
        let { angle, angleVelocity } = stream.my;

        let delta = (angle - stream.my.targetAngle) % 360;
        if (Math.abs(delta) < 1 && angleVelocity < 1) {
          stream.do.setAngle(stream.my.targetAngle);
          stream.do.setAngleVelocity(0);
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

        stream.do.setAngle(angle);
        stream.do.setAngleVelocity(angleVelocity * 0.8);

        if (angleVelocity || (angle !== stream.my.targetAngle)) {
          setTimeout(stream.do.moveToTargetAngle, 100);
        }
      })
      .addProp('directionIndicator')
      .addProp('disc');

    this.state = { ...this.stream.state };
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
    if (this._bsPos) clearInterval(this._bsPos);
  }

  componentDidMount() {
    this._bsPos = setInterval(() => {
      this.stream.do.updateOffset();
      this.props.setOffset(this.stream.my.offset);
    }, 50);

    this._sub = this.stream.filter('angle', 'targetAngle', 'throttle')
      .subscribe((state) => this.setState(state));
    if (this.props.setControlStream) {
      this.props.setControlStream(this.stream);
    }
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
              if (is.number(a)) this.stream.do.setAngle(a);
              else {
                console.log('setDirection - bad value: ', a);
              }
            }}
            direction={angle}
            throttle={throttle}
            setThrottle={(n) => {
              console.log('setThrottle called with ', n);
              this.stream.do.setThrottle(n);
            }}
          />
        </div>
      </>
    );
  }
}
