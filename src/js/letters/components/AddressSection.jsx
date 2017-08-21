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
          <div>When you download a letter, it will show this address on it. You may want to update it if it's incorrect, but you can still download and use letters with an incorrect address.</div>
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
