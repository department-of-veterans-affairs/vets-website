import React from 'react';
import classNames from 'classnames';

class ButtonDelete extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClickHandler();
  }

  render() {
    const buttonClass = classNames(this.props.className, 'msg-btn-delete');

    return (
      <button
          onClick={this.handleClick}
          className={buttonClass}
          type="button">
        <i className="fa fa-trash"></i>
        <span>Delete</span>
      </button>
    );
  }
}

ButtonDelete.propTypes = {
  className: React.PropTypes.string,
  onClickHandler: React.PropTypes.func.isRequired
};

export default ButtonDelete;
