import React from 'react';

class ButtonMove extends React.Component {
  render() {
    return (
      <button className="messaging-move">
        <span>Move</span>
        <i className="fa fa-caret-down"></i>
      </button>
    );
  }
}

export default ButtonMove;

