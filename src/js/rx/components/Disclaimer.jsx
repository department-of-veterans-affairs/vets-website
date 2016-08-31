import React from 'react';

class Disclaimer extends React.Component {
  render() {
    return (
      <div className="rx-disclaimer cf" hidden={!this.props.isVisible}>
        <p className="row">
          <b>This list may not include all of your medications. </b>
          We only list prescriptions the <abbr>VA</abbr> can refill by mail.
          <button
              className="rx-disclaimer-close usa-button-unstyled"
              onClick={this.props.handleClose}>
            <i className="fa fa-close"></i>
            <i className="usa-sr-only">Close</i>
          </button>
        </p>
      </div>
    );
  }
}

Disclaimer.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  handleClose: React.PropTypes.func.isRequired
};

export default Disclaimer;
