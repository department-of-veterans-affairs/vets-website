/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/facilityAddress';

class LocationDirectionsLink extends Component {
  render() {
    const { location } = this.props;
    const address = buildAddressArray(location).join(', ');

    return (
      <span>
        <a href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`} target="_blank">
          <i className="fa fa-road" /> Directions
        </a>
      </span>
    );
  }
}

LocationDirectionsLink.propTypes = {
  location: PropTypes.object,
};

export default LocationDirectionsLink;
