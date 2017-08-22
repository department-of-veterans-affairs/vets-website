import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { invalidAddressProperty } from '../utils/helpers.jsx';

class AddressSection extends React.Component {
  render() {
    const destination = this.props.destination || {};
    const addressLines = [
      destination.addressLine1,
      destination.addressLine2 ? `, ${destination.addressLine2}` : '',
      destination.addressLine3 ? ` ${destination.addressLine3}` : ''
    ];

    let addressContent;
    if (isEmpty(destination)) {
      addressContent = (
        <div className="step-content">
          {invalidAddressProperty}
        </div>
      );
    } else {
      addressContent = (
        <div className="step-content">
          <p>
            Downloaded documents will list your address as:
          </p>
          <div className="letters-address">{(destination.fullName || '').toLowerCase()}</div>
          <div className="letters-address">{addressLines.join('').toLowerCase()}</div>
          <div className="letters-address">{(destination.city || '').toLowerCase()}, {destination.state} {(destination.zipCode || '').toLowerCase()}</div>
          <div>EDIT</div>
          <div>When you download a letter, it will show this address. If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address.</div>
        </div>
      );
    }

    return (
      <div>
        {addressContent}
      </div>
    );
  }
}

AddressSection.propTypes = {
  destination: PropTypes.object
};

export default AddressSection;
