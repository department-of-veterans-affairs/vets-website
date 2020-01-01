import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compact, isEmpty } from 'lodash';

class FacilityDirectionsLink extends Component {
  buildAddressArray = location => {
    if (location?.address?.street) {
      const { address } = location;
      return compact([
        address.street,
        `${address.city}, ${address.state} ${address.zipCode}`,
      ]);
    }

    if (location?.type === 'cc_provider') {
      const { address } = location;

      if (!isEmpty(address)) {
        return compact([
          address.street,
          address.appt,
          `${address.city}, ${address.state} ${address.zip}`,
        ]);
      }

      return [];
    }

    const {
      address: { physical: address },
    } = location;

    return compact([
      address.address1,
      address.address2,
      address.address3,
      `${address.city}, ${address.state} ${address.zip}`,
    ]);
  };

  render() {
    const { location } = this.props;
    if (location) {
      let address = this.buildAddressArray(location);

      if (address.length !== 0) {
        address = address.join(', ');
      } else {
        // If we don't have an address fallback on coords
        const { lat, long } = location;
        address = `${lat},${long}`;
      }

      return (
        <span>
          <a
            href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Directions
          </a>
        </span>
      );
    }
    return null;
  }
}

FacilityDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default FacilityDirectionsLink;
