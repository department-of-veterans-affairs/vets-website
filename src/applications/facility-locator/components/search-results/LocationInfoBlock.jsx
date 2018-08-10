import { distBetween } from '../../utils/facilityDistance';
import { Link } from 'react-router';
import LocationAddress from './LocationAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FacilityTypeDescription from '../FacilityTypeDescription';

class LocationInfoBlock extends Component {
  renderDistance() {
    const { currentLocation, location } = this.props;
    if (currentLocation) {
      const distance = distBetween(
        currentLocation.latitude,
        currentLocation.longitude,
        location.attributes.lat,
        location.attributes.long,
      );
      return (
        <p>
          <strong>Distance:</strong> {distance.toFixed(1)} miles
        </p>
      );
    }

    return null;
  }

  render() {
    const { location } = this.props;
    const { name } = location.attributes;

    return (
      <div>
        <Link to={`facility/${location.id}`}>
          <h5>{name}</h5>
        </Link>
        <FacilityTypeDescription location={location}/>
        <p>
          <LocationAddress location={location}/>
        </p>
        {this.renderDistance()}
      </div>
    );
  }
}

LocationInfoBlock.propTypes = {
  location: PropTypes.object,
};

export default LocationInfoBlock;
