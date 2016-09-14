import React from 'react';
import classNames from 'classnames';

class ButtonDelete extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick();
  }

  render() {
    const isTextVisible = classNames({
      'usa-sr-only': this.props.compact
    });

    return (
      <button
          onClick={this.handleClick}
          className="messaging-btn-delete">
        <i className="fa fa-trash"></i>
        <span className={isTextVisible}>Delete</span>
      </button>
    );
  }
}

ButtonDelete.propTypes = {
  compact: React.PropTypes.bool,
  onClick: React.PropTypes.func.required
};

export default ButtonDelete;
