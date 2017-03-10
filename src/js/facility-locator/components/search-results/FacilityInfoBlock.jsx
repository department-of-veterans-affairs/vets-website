import { distBetween } from '../../utils/facilityDistance';
import { Link } from 'react-router';
import FacilityAddress from './FacilityAddress';
import React, { Component, PropTypes } from 'react';

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
    const { name, facility_type: facilityType } = facility.attributes;

    /* eslint-disable camelcase */
    const facilityTypes = {
      va_health_facility: 'Health',
      va_cemetery: 'Cemetery',
      va_benefits_facility: 'Benefits',
    };
    /* eslint-enable camelcase */

    return (
      <div>
        <Link to={`facility/${facility.id}`}>
          <h5>{name}</h5>
        </Link>
        <p>
          <FacilityAddress facility={facility}/>
        </p>
        {this.renderDistance()}
        <p>
          <span><strong>Facility type:</strong> {facilityTypes[facilityType]}</span>
        </p>
      </div>
    );
  }
}

FacilityInfoBlock.propTypes = {
  facility: PropTypes.object,
};

export default FacilityInfoBlock;
