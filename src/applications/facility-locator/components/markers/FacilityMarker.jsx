import DivMarker from './DivMarker';
import PropTypes from 'prop-types';
import React from 'react';

function FacilityMarker({ position, onClick, markerText }) {
  return (
    <DivMarker position={position} onClick={onClick}>
      <span className="i-pin-card-map">{markerText}</span>
    </DivMarker>
  );
}

FacilityMarker.propTypes = {
  position: PropTypes.array,
  markerText: PropTypes.string,
};

export default FacilityMarker;
