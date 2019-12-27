import React, { PureComponent } from 'react';
import { Box } from 'grommet';

export default class UniverseView extends PureComponent {
  render() {
    const { reference, children } = this.props;
    return (
      <div className="layer-fill-container">
        <div
          style={({
            width: '100%', height: '100%', overflow: 'hidden', background: 'black',
          })}
          ref={reference}
        />
        {children}
      </div>
    );
  }
}
