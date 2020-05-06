import DivMarker from './DivMarker';
import PropTypes from 'prop-types';
import React from 'react';

function HereMarker({ position }) {
  return (
    <DivMarker position={position} onClick={null}>
      <div className="here-pin"> {null}</div>
    </DivMarker>
  );
}

HereMarker.propTypes = {
  position: PropTypes.array,
};

export default HereMarker;
