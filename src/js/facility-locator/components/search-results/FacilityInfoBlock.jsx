import React, { Component, PropTypes } from 'react';
import { compact } from 'lodash';
import { Link } from 'react-router';

class FacilityInfoBlock extends Component {
  render() {
    const { facility } = this.props;
    const { address, name } = facility.attributes;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    /* eslint-disable camelcase */
    const facilityTypes = {
      va_health_facility: 'Health',
      va_cemetery: 'Cemetery',
      va_benefits_facility: 'Benefits',
    };
    /* eslint-enable camelcase */

    return (
      <div>
        <Link to={`facilities/facility/${facility.id}`}>
          <h5>{name}</h5>
        </Link>
        <p>
          {addressString[0]}<br/>
          {addressString[1]}
        </p>
        <p>
          <span>Facility type: <strong>{facilityTypes[facility.type]}</strong></span>
        </p>
      </div>
    );
  }
}

FacilityInfoBlock.propTypes = {
  facility: PropTypes.object,
};

export default FacilityInfoBlock;
