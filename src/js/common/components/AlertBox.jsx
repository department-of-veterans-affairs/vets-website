// import PropTypes from 'prop-types';
// import React from 'react';
// import classNames from 'classnames';
import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';

export default AlertBox;

/*
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
      return <div aria-live="polite"/>;
    }

    const alertClass = classNames(
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

    const headline = this.props.headline && (<h4 className="usa-alert-heading">{this.props.headline}</h4>);

    return (
      <div
        aria-live="polite"
        className={alertClass}
        ref={(ref) => { this._ref = ref; }}>
        <div className="usa-alert-body">
          {headline}
          <div className="usa-alert-text">
            {this.props.content}
          </div>
          <div className="alert-actions">
            {this.props.primaryButton && <button className="usa-button" onClick={this.props.primaryButton.action}>{this.props.primaryButton.text}</button>}
            {this.props.secondaryButton && <button className="usa-button-secondary" onClick={this.props.secondaryButton.action}>{this.props.secondaryButton.text}</button>}
          </div>
        </div>
        {closeButton}
        <div className="cf"></div>
      </div>
    );
  }

}

AlertBox.propTypes = {
  headline: PropTypes.node,
  content: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onCloseAlert: PropTypes.func,
  scrollOnShow: PropTypes.bool,
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  secondaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  status: PropTypes.oneOf([
    'info',
    'error',
    'success',
    'warning'
  ]).isRequired
};
*/

