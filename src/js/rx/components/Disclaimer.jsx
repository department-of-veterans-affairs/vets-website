import React from 'react';
import classNames from 'classnames';


class Disclaimer extends React.Component {
  render() {
    const openClass = classNames(
      { 'rx-disclaimer--open': this.props.isOpen }
    );

    const openButton = classNames(
      { 'fa-chevron-down': !this.props.isOpen },
      { 'fa-chevron-up': this.props.isOpen }
    );

    const buttonText = this.props.isOpen ? 'Hide this message' : 'Show this message';

    return (
      <div
          className={`rx-disclaimer cf ${openClass}`}
          aria-expanded={this.props.isOpen}>
        <div className="row">
          <h5>THIS LIST MAY NOT INCLUDE ALL YOUR MEDICATIONS</h5>
          <p
              className="rx-disclaimer-body"
              hidden={!this.props.isOpen}>
          We only list prescriptions VA can refill by mail. If you have any questions about your medication list, please contact your health care team.</p>
          <button
              className="rx-disclaimer-close usa-button-unstyled"
              onClick={this.props.handleClose}>
            <i className={`fa ${openButton}`}></i>
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
