import React from 'react';
import classNames from 'classnames';


class Disclaimer extends React.Component {
  render() {
    const disclaimerClass = classNames(
      'rx-disclaimer',
      { 'va-alert--open': this.props.isOpen },
      { 'va-alert usa-alert usa-alert-warning': true },
    );

    const openButton = classNames(
      { fa: true },
      { 'fa-plus': !this.props.isOpen },
      { 'fa-minus': this.props.isOpen }
    );

    const buttonText = this.props.isOpen ? 'Hide this message' : 'Show this message';

    return (
      <div
          className={disclaimerClass}
          aria-expanded={this.props.isOpen}>
        <div className="usa-alert-body va-alert-body">
          <h5 className="va-alert-title">This list may not include all your medications</h5>
          <p hidden={!this.props.isOpen}>
          If you have any questions about your medication list, please contact your health care team.</p>
          <button
              className="va-alert-close usa-button-unstyled"
              onClick={this.props.handleClose}>
            <i className={openButton}></i>
            <i className="usa-sr-only">{buttonText}</i>
          </button>
        </div>
      </div>
    );
  }
}

Disclaimer.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  handleClose: React.PropTypes.func.isRequired
};

export default Disclaimer;
