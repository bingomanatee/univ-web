import React, { Component } from 'react';
import _ from 'lodash';

import CursorView from './Cursor';

export default class CursorContainer extends Component {
  constructor(params) {
    super(params);
    this.stream = params.stream;
    this.state = _.pick(this.stream.asObject, ['highlightedHex']);
  }

  componentDidMount() {
    this._sub = this.stream.filter('highlightedHex').subscribe((state) => {
      this.setState(state);
    });
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  render() {
    const { centerUSGHex } = this.state;
    console.log('cursor center:', centerUSGHex);

    let centerid = _.get(this, 'state.highlightedHex.sector.id', 'x0y0z0.x0y0z0');
    if (centerid) centerid = centerid.replace('x0y0z0.', '');
    const galaxies = _.get(this, 'state.highlightedHex.galaxies', 0);
    return <CursorView centerid={centerid} galaxies={galaxies} />;
  }
}
