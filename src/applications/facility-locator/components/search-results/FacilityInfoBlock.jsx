import { distBetween } from '../../utils/facilityDistance';
import { Link } from 'react-router';
import FacilityAddress from './FacilityAddress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FacilityTypeDescription from '../FacilityTypeDescription';

class FacilityInfoBlock extends Component {
  renderDistance() {
    const { currentLocation, facility } = this.props;
    if (currentLocation) {
      const distance = distBetween(
        currentLocation.latitude,
        currentLocation.longitude,
        facility.attributes.lat,
        facility.attributes.long,
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
    const { facility } = this.props;
    const { name } = facility.attributes;

    return (
      <div>
        <Link to={`facility/${facility.id}`}>
          <h5>{name}</h5>
        </Link>
        <FacilityTypeDescription facility={facility} />
        <p>
          <FacilityAddress facility={facility} />
        </p>
        {this.renderDistance()}
      </div>
    );
  }
}

FacilityInfoBlock.propTypes = {
  facility: PropTypes.object,
};

export default FacilityInfoBlock;
