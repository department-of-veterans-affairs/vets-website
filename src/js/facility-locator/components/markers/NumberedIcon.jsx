import DivMarker from './DivMarker';
import React, { Component, PropTypes } from 'react';

class NumberedIcon extends Component {
  render() {
    const style = {
      height: '24px',
      marginLeft: '-12px',
      marginTop: '-12px',
      textAlign: 'center',
      width: '24px',
      zIndex: '999',
    };

    const { position, children, number } = this.props;

    return (
      <DivMarker position={position} popupContent={children}>
        <div className="numbered-icon" style={style}>{number}</div>
      </DivMarker>
    );
  }
}

NumberedIcon.propTypes = {
  position: PropTypes.array,
  number: PropTypes.number,
};

export default NumberedIcon;
