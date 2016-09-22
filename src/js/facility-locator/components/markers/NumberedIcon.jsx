import DivMarker from './DivMarker';
import React, { Component, PropTypes } from 'react';

class NumberedIcon extends Component {
  render() {
    const { position, children, number, style } = this.props;

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
