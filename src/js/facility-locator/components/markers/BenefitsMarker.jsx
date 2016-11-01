import DivMarker from './DivMarker';
import React, { Component, PropTypes } from 'react';

class BenefitsMarker extends Component {
  render() {
    const { position, children, style, onClick } = this.props;

    return (
      <DivMarker position={position} popupContent={<div>{children}</div>} onClick={onClick}>
        <div className="benefits-icon map-marker" style={style}>
        </div>
      </DivMarker>
    );
  }
}

BenefitsMarker.defaultProps = {
  onClick: () => {},
};

BenefitsMarker.propTypes = {
  position: PropTypes.array,
};

export default BenefitsMarker;
