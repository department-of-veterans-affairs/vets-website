import React from 'react';
import classNames from 'classnames';


class Disclaimer extends React.Component {
  render() {
    const disclaimerClass = classNames(
      { 'rx-disclaimer--open': this.props.isOpen },
      { 'rx-disclaimer--closed': !this.props.isOpen },
      { 'rx-disclaimer': true },
      { cf: true }
    );

    const openButton = classNames(
      { fa: true },
      { 'fa-chevron-down': !this.props.isOpen },
      { 'fa-chevron-up': this.props.isOpen }
    );

    const buttonText = this.props.isOpen ? 'Hide this message' : 'Show this message';

    return (
      <div
          className={disclaimerClass}
          aria-expanded={this.props.isOpen}>
        <div className="row">
          <h5 className="rx-disclaimer-title">THIS LIST MAY NOT INCLUDE ALL YOUR MEDICATIONS</h5>
          <p
              className="rx-disclaimer-body"
              hidden={!this.props.isOpen}>
          If you have any questions about your medication list, please contact your health care team.</p>
          <button
              className="rx-disclaimer-close usa-button-unstyled"
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
