import DivMarker from './DivMarker';
import React, { Component, PropTypes } from 'react';

class TownHall extends Component {
  render() {
    const style = {
      backgroundColor: '#2e8540',
      borderRadius: '50%',
      marginTop: '-12px',
      marginLeft: '-12px',
      width: '24px',
      height: '24px',
      zIndex: '999',
    };

    const { position, children } = this.props;

    return (
      <DivMarker position={position} popupContent={children}>
        <div style={style}></div>
      </DivMarker>
    );
  }
}

TownHall.propTypes = {
  position: PropTypes.array,
};

export default TownHall;
