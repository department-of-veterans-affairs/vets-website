import React, { Component, PropTypes } from 'react';
import FacilityDetailsInfoAddress from '../components/FacilityDetailsInfoAddress'
import FacilityDetailsInfoPhone from '../components/FacilityDetailsInfoPhone'

class FacilityDetailsInfo extends Component {
  render() {
    let street1 = this.props.address.street1;
    let street2 = this.props.address.street2;
    let cityStateZip = `${this.props.address.city}, ${this.props.address.state} ${this.props.address.zip}`;

    return (
      <li style={{ width: '30%', listStyleType: 'none' }}>
        <h2>Facility Details</h2>
        <FacilityDetailsInfoAddress street1={street1} street2={street2} cityStateZip={cityStateZip} />
        <FacilityDetailsInfoPhone main={this.props.phone.main} fax={this.props.phone.fax} />
      </li>
    );
  }
}

FacilityDetailsInfo.propTypes = {
  address: PropTypes.object.isRequired,
  phone: PropTypes.object.isRequired
}

export default FacilityDetailsInfo;