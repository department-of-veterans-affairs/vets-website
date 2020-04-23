import DivMarker from './DivMarker';
import PropTypes from 'prop-types';
import React from 'react';

function BenefitsMarker({ position, style, onClick = () => {}, children }) {
  return (
    <DivMarker
      position={position}
      popupContent={<div>{children}</div>}
      onClick={onClick}
    >
      <div className="benefits-icon map-marker" style={style} />
    </DivMarker>
  );
}

BenefitsMarker.propTypes = {
  position: PropTypes.array,
};

export default BenefitsMarker;
