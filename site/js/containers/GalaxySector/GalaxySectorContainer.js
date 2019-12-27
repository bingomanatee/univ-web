import React, { Component } from 'react';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import _ from 'lodash';
import {
  Box, Grid, Layer, Button, Footer,
} from 'grommet';
import styled from 'styled-components';

import galaxyStoreFactory from './galaxySector.store';

const CloseBtnWrapper = styled.div`
position: absolute;
left: 1rem;
top: 1rem;
`;

export default class GalaxySectorContainer extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.stream = galaxyStoreFactory(props);
    console.log('GalaxySectorContainer stream -- ', this.stream);
    this.state = { ...this.stream.asObject };
    this.pixiRef = React.createRef();
    this.resizeApp = _.debounce(() => this.stream.do.resizeApp(this.props.size), 200);
  }

  componentDidMount() {
    this._sub = this.stream.subscribe((stream) => {
      this.setState(stream.asObject);
    });
    const ele = this.pixiRef.current;
    console.log('initializing stream with size: ', this.props.size, 'ele:', ele);
    this.stream.do.tryInit(ele, this.props.size);
  }


  componentDidUpdate(prevProps) {
    const prevWidth = _.get(prevProps, 'size.width');
    const prevHeight = _.get(prevProps, 'size.height');
    if (prevWidth !== _.get(this, 'props.size.width') || prevHeight !== _.get(this, 'props.size.height')) {
      this.resizeApp();
    }
  }

  componentWillUnmount() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  render() {
    return (
      <>
        <div
          ref={this.pixiRef}
          className="layer-fill"
        />
        <CloseBtnWrapper>
          <Button primary plain={false} onClick={this.props.close}>
            Close
          </Button>
        </CloseBtnWrapper>
      </>
    );
  }
}
