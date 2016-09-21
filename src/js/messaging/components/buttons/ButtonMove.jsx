import React from 'react';

class ButtonMove extends React.Component {
  render() {
    return (
      <button
          className="messaging-move"
          onClick={this.props.onClick}>
        <span>Move</span>
        <i className="fa fa-caret-down"></i>
      </button>
    );
  }
}

ButtonMove.propTypes = {
  onClick: React.PropTypes.func.isRequired
};

export default ButtonMove;

