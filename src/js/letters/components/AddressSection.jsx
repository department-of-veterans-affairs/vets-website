import React from 'react';
import PropTypes from 'prop-types';

class AddressSection extends React.Component {
  render() {
    const destination = this.props.destination || {};
    const addressLines = [
      destination.addressLine1,
      destination.addressLine2 ? `, ${destination.addressLine2}` : '',
      destination.addressLine3 ? ` ${destination.addressLine3}` : ''
    ];
    return (
      <div className="step-content">
        <div className="letters-address">{destination.fullName.toLowerCase()}</div>
        <div className="letters-address">{addressLines.join('').toLowerCase()}</div>
        <div className="letters-address">{destination.city.toLowerCase()}, {destination.state} {destination.zipCode.toLowerCase()}</div>
        <h5>Why is this address important?</h5>
        <div>When you download a letter, it will show this address on it. If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address. <a href="https://eauth.va.gov/wssweb/wss-common-webparts/mvc/getPCIUUpdateForm" target="_blank">Update the address that appears on your letter(s)</a>.</div>
      </div>
    );
  }
}

AddressSection.propTypes = {
  destination: PropTypes.object
};

export default AddressSection;
