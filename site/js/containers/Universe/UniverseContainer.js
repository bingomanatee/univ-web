import React, { Component } from 'react';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import _ from 'lodash';
import { Layer } from 'grommet';

import univStoreFactory from './univ.store';
import UniverseView from './UniverseView';
import Controls from '../Controls';
import Cursor from './Cursor';

export default class UniverseContainer extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.stream = univStoreFactory(props);
    this.state = { ...this.stream.state };
    this.resizeApp = _.debounce(() => this.stream.do.resizeApp(this.props.size), 200);
  }

  componentDidMount() {
    const { size } = this.props;
    const ele = _.get(this, 'ref.current');
    if (ele) {
      this.stream.do.tryInit(ele, size);
    }
    this.moveSub = fromEvent(window, 'mousemove')
      .pipe(throttleTime(100))
      .subscribe((event) => {
        this.stream.do.updateMousePos(_.get(event, 'clientX', 0), _.get(event, 'clientY', 0));
      });

    this.stream.subscribe((stream) => {
      const galaxy = stream.get('currentGalaxy');
      if (galaxy !== _.get(this, 'state.galaxy')) this.setState({ galaxy });
    },
    (err) => {
      console.log('galaxy stream error: ', err);
    });

    this.stream.watch('currentGalaxy', (galaxy) => {
      console.log('current galaxy: ', galaxy);
    });
  }

  componentDidUpdate(prevProps) {
    const prevWidth = _.get(prevProps, 'size.width');
    const prevHeight = _.get(prevProps, 'size.height');
    if (prevWidth !== _.get(this, 'props.size.width') || prevHeight !== _.get(this, 'props.size.height')) {
      this.resizeApp();
    }
  }

  render() {
    return (
      <UniverseView reference={this.ref}>
        <Layer plain position="center"><Cursor stream={this.stream} /></Layer>
        <Layer plain position="bottom-right"><Controls setOffset={this.stream.do.setOffset} /></Layer>
      </UniverseView>
    );
  }
}
