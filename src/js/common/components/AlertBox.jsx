import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class AlertBox extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToAlert = this.scrollToAlert.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const visibilityChanged = this.props.isVisible !== nextProps.isVisible;
    const contentChanged = this.props.content !== nextProps.content;
    const statusChanged = this.props.status !== nextProps.status;
    return visibilityChanged || contentChanged || statusChanged;
  }

  componentDidUpdate() {
    if (this.props.isVisible && this.props.scrollOnShow) {
      this.scrollToAlert();
    }
  }

  scrollToAlert() {
    const isInView = window.scrollY <= this._ref.offsetTop;

    if (this._ref && !isInView) {
      this._ref.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      });
    }
  }

  render() {
    if (!this.props.isVisible) {
      return <div aria-live="assertive"/>;
    }

    const alertClass = classNames(
      'va-alert',
      'usa-alert',
      `usa-alert-${this.props.status}`
    );

    let closeButton;
    if (this.props.onCloseAlert) {
      closeButton = (
        <button className="va-alert-close" aria-label="Close notification" onClick={this.props.onCloseAlert}>
          <i className="fa fa-close" aria-label="Close icon"></i>
        </button>
      );
    }

    return (
      <div
        aria-live="assertive"
        className={alertClass}
        ref={(ref) => { this._ref = ref; }}>
        <div className="va-alert-body usa-alert-body">
          <div className="usa-alert-text usa-alert-heading">
            {this.props.content}
          </div>
        </div>
        {closeButton}
        <div className="cf"></div>
      </div>
    );
  }
}

AlertBox.propTypes = {
  content: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onCloseAlert: PropTypes.func,
  scrollOnShow: PropTypes.bool,
  status: PropTypes.oneOf([
    'info',
    'error',
    'success',
    'warning'
  ]).isRequired
};

export default AlertBox;
