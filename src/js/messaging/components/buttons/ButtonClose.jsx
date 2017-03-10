import React from 'react';
import classNames from 'classnames';

class ButtonClose extends React.Component {
  render() {
    const buttonClass = classNames(
      'usa-button-unstyled',
      this.props.className
    );

    return (
      <button
          className={buttonClass}
          data-args={this.props.args}
          onClick={this.props.onClick}
          type="button">
        <i className="fa fa-close"></i>
      </button>
    );
  }
}

ButtonClose.propTypes = {
  args: React.PropTypes.string,
  className: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};

export default ButtonClose;
