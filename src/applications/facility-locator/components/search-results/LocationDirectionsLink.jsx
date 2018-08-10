import { buildAddressArray } from '../../utils/facilityAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class LocationDirectionsLink extends Component {
  render() {
    const { location } = this.props;
    const address = buildAddressArray(location).join(', ');

    return (
      <span>
        <a href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`} target="_blank">
          <i className="fa fa-road"/>Directions
        </a>
      </span>
    );
  }
}

LocationDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default LocationDirectionsLink;
