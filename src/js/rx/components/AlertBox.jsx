import React from 'react';

import classNames from 'classnames';

class AlertBox extends React.Component {
  render() {
    if (!this.props.isVisible) {
      return <div/>;
    }

    let alertClass = classNames({
      'rx-alert': true,
      'usa-alert': true,
      [`usa-alert-${this.props.status}`]: true
    });

    let closeButton;
    if (this.props.onCloseAlert) {
      closeButton = (
        <a className="rx-alert-close" onClick={this.props.onCloseAlert}>
          <i className="fa fa-close"></i>
        </a>
      );
    }

    return (
      <div className={alertClass}>
        <div className="rx-alert-body usa-alert-body">
          <p className="rx-alert-text usa-alert-text">
            {this.props.content}
          </p>
        </div>
        {closeButton}
        <div className="cf"></div>
      </div>
    );
  }
}

AlertBox.propTypes = {
  content: React.PropTypes.element.isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  onCloseAlert: React.PropTypes.func,
  status: React.PropTypes.oneOf([
    'info',
    'error',
    'success',
    'warning'
  ]).isRequired
};

export default AlertBox;
