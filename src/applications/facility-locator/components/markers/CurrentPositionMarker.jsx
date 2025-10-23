import DivMarker from './DivMarker';
import PropTypes from 'prop-types';
import React from 'react';

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
