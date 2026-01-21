import React from 'react';
import PropTypes from 'prop-types';
import DivMarker from './DivMarker';

function CurrentPositionMarker({ position }) {
  return (
    <DivMarker position={position} onClick={null}>
      <div className="current-pos-pin" />
    </DivMarker>
  );
}

CurrentPositionMarker.propTypes = {
  position: PropTypes.array,
};

export default CurrentPositionMarker;
