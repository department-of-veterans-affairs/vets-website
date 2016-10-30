import DivMarker from './DivMarker';
import React, { Component, PropTypes } from 'react';

class HealthMarker extends Component {
  render() {
    const { position, children, style, onClick } = this.props;

    return (
      <DivMarker position={position} popupContent={<div>{children}</div>} onClick={onClick}>
        <div className="health-icon map-marker" style={style}>
        </div>
      </DivMarker>
    );
  }
}

HealthMarker.defaultProps = {
  onClick: () => {},
};

HealthMarker.propTypes = {
  position: PropTypes.array,
};

export default HealthMarker;
