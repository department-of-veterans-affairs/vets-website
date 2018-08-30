import DivMarker from './DivMarker';
import { array } from 'prop-types';
import React, { Component } from 'react';

class ProviderMarker extends Component {
  render() {
    const { position, children, style, onClick } = this.props;

    return (
      <DivMarker position={position} popupContent={<div>{children}</div>} onClick={onClick}>
        <div className="cc-provider-icon map-marker" style={style}>
        </div>
      </DivMarker>
    );
  }
}

ProviderMarker.defaultProps = {
  onClick: () => {},
};

ProviderMarker.propTypes = {
  position: array,
};

export default ProviderMarker;
