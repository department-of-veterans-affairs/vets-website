import React from 'react';

class ButtonDelete extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClickHandler();
  }

  render() {
    return (
      <button
          onClick={this.handleClick}
          className="va-icon-link messaging-btn-delete"
          type="button">
        <i className="fa fa-trash"></i>
        <span>Delete</span>
      </button>
    );
  }
}

ButtonDelete.propTypes = {
  onClickHandler: React.PropTypes.func.isRequired
};

export default ButtonDelete;
