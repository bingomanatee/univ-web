import React, { Component } from 'react';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import _ from 'lodash';
import { Box, Grid, Layer } from 'grommet';

import univStoreFactory from './univ.store';
import UniverseView from './UniverseView';
import Controls from '../Controls';
import Cursor from '../Cursor';

import GalaxySector from '../GalaxySector';

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

    this._sub = this.stream.filter('galaxy', 'zoomed')
      .subscribe((state) => {
        this.setState(state);
      },
      (err) => {
        console.log('universe stream error: ', err);
      });
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
    this.stream.my.app.destroy();
  }

  componentDidUpdate(prevProps) {
    const prevWidth = _.get(prevProps, 'size.width');
    const prevHeight = _.get(prevProps, 'size.height');
    if (prevWidth !== _.get(this, 'props.size.width') || prevHeight !== _.get(this, 'props.size.height')) {
      this.resizeApp();
    }
  }

  render() {
    const { zoomed } = this.state;
    console.log('zoomed: ', zoomed);
    return (
      <UniverseView reference={this.ref}>
        <div className="layer-fill">
          <Grid
            fill
            rows={['279px', '1fr', '120px', '1fr', '279px']}
            columns={['1fr', '80px', '1fr']}
            areas={[
              { name: 'cursor', start: [1, 2], end: [1, 2] },
              { name: 'controls', start: [2, 4], end: [2, 4] },
            ]}
          >
            <Box fill gridArea="cursor"><Cursor stream={this.stream} /></Box>
            <Box fill gridArea="controls" align="end" alignContent="end">
              <Controls
                setOffset={this.stream.do.setOffset}
                setControlStream={this.stream.do.setControlsStream}
              />
            </Box>
          </Grid>
        </div>
        {(zoomed) ? (
          <GalaxySector close={this.stream.do.endZoom} getSector={() => this.stream.my.highlightedHex} />
        ) : ''}
      </UniverseView>
    );
  }
}
