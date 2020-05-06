import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FacilityDirectionsLink extends Component {
  buildAddressArray = location => {
    if (location?.type === 'cc_provider') {
      const { address } = location;

      if (address && Object.keys(address).length) {
        return [
          address.street,
          address.appt,
          `${address.city}, ${address.state} ${address.zip}`,
        ].filter(x => !!x);
      }

      return [];
    }

    if (location?.address?.street) {
      const { address } = location;
      return [
        address.street,
        `${address.city}, ${address.state} ${address.zipCode}`,
      ].filter(x => !!x);
    }

    const {
      address: { physical: address },
    } = location;

    return [
      address.address1,
      address.address2,
      address.address3,
      `${address.city}, ${address.state} ${address.zip}`,
    ].filter(x => !!x);
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
            aria-label={`Directions to ${location.name ||
              location.providerPractice}`}
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
