import { Link } from 'react-router';
import FacilityAddress from './FacilityAddress';
import React, { Component, PropTypes } from 'react';

class FacilityInfoBlock extends Component {
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
        <Link to={`/facilities/facility/${facility.id}`}>
          <h5>{name}</h5>
        </Link>
        <p>
          <FacilityAddress facility={facility}/>
        </p>
        <p>
          <span>Facility type: <strong>{facilityTypes[facilityType]}</strong></span>
        </p>
      </div>
    );
  }
}

FacilityInfoBlock.propTypes = {
  facility: PropTypes.object,
};

export default FacilityInfoBlock;
