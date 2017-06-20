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
        <div>{destination.fullName}</div>
        <div>{addressLines.join('')}</div>
        <div>{destination.city}, {destination.state} {destination.zipCode}</div>
        <h5>Why is this address important?</h5>
        <div>The letters you download include this address. The letter is valid even if the address is wrong. To change the address on your letter, please call the Vets.gov Help Desk or visit <a href="">this link.</a></div>
      </div>
    );
  }
}

AddressSection.propTypes = {
  destination: PropTypes.object
};

export default AddressSection;
