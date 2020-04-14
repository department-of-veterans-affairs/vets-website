import DivMarker from './DivMarker';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FacilityMarker extends Component {
  render() {
    const { position, onClick, markerText } = this.props;
    return (
      <DivMarker position={position} onClick={onClick}>
        <span className="i-pin-card-map"> {markerText}</span>
      </DivMarker>
    );
  }
}

FacilityMarker.propTypes = {
  position: PropTypes.array,
  markerText: PropTypes.string,
};

export default FacilityMarker;
