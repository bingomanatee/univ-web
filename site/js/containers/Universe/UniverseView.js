import React, { PureComponent } from 'react';
import { Layer } from 'grommet';

export default class UniverseView extends PureComponent {
  render() {
    const { reference, children } = this.props;
    return (
      <>
        <div style={({ width: '100%', height: '100%', background: 'black' })} ref={reference} />
        {children}
      </>
    );
  }
}
