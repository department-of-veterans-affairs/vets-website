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
    const isTextVisible = classNames({
      'usa-sr-only': this.props.compact
    });

    return (
      <button
          onClick={this.handleClick}
          className="messaging-btn-delete"
          type="button">
        <i className="fa fa-trash"></i>
        <span className={isTextVisible}>Delete</span>
      </button>
    );
  }
}

ButtonDelete.propTypes = {
  compact: React.PropTypes.bool,
  onClickHandler: React.PropTypes.func.isRequired
};

export default ButtonDelete;
