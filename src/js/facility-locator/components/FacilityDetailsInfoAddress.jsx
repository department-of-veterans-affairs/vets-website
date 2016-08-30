import React, { Component, PropTypes } from 'react';

class FacilityDetailsInfoAddress extends Component {
  render() {
    return (
      <div>
        <h5>Street Address:</h5>
        <div>
          <div className="street">{this.props.street1}</div>
          {this.props.street2 ? <div className="street">{this.props.street2}</div> : null}
          <div className="city-state-zip">{this.props.cityStateZip}</div>
        </div>
      </div>
    );
  }
}

FacilityDetailsInfoAddress.propTypes = {
  street1: PropTypes.string.isRequired,
  street2: PropTypes.string,
  cityStateZip: PropTypes.string.isRequired
};

export default FacilityDetailsInfoAddress;
