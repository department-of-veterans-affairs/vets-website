import React from 'react';
import classNames from 'classnames';

class AlertBox extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToAlert = this.scrollToAlert.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isVisible && this.props.scrollOnShow) {
      this.scrollToAlert();
    }
  }

  scrollToAlert() {
    const isInView =
      this._ref && window.scrollY <= this._ref.offsetTop;

    if (!isInView) {
      this._ref.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      });
    }
  }

  render() {
    if (!this.props.isVisible) {
      return <div/>;
    }

    const alertClass = classNames(
      'va-alert',
      'usa-alert',
      `usa-alert-${this.props.status}`
    );

    let closeButton;
    if (this.props.onCloseAlert) {
      closeButton = (
        <button className="va-alert-close" onClick={this.props.onCloseAlert}>
          <i className="fa fa-close"></i>
        </button>
      );
    }

    return (
      <div
          className={alertClass}
          ref={(ref) => { this._ref = ref; }}>
        <div className="va-alert-body usa-alert-body">
          <p className="va-alert-text usa-alert-heading">
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
  content: React.PropTypes.node.isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  onCloseAlert: React.PropTypes.func,
  scrollOnShow: React.PropTypes.bool,
  status: React.PropTypes.oneOf([
    'info',
    'error',
    'success',
    'warning'
  ]).isRequired
};

export default AlertBox;
