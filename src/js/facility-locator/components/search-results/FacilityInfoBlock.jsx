import React, { Component, PropTypes } from 'react';
import { compact } from 'lodash';
import { Link } from 'react-router';

class FacilityInfoBlock extends Component {

  renderNCAAddress() {
    const { facility } = this.props;
    const { address: { physical: address } } = facility.attributes;
    const addressString = compact([
      address.address1,
      address.address2,
      `${address.city}, ${address.state} ${address.zip}`
    ]);
    return addressString;
  }

  renderVHAAddress() {
    const { facility } = this.props;
    const { address: { physical: address } } = facility.attributes;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}`
    ];
    return addressString;
  }

  render() {
    const { facility } = this.props;
    const { name, facility_type: facilityType } = facility.attributes;

    const addressString = ((type) => {
      switch (type) {
        case 'va_health_facility':
          return this.renderVHAAddress();
        case 'va_cemetery':
          return this.renderNCAAddress();
        default:
          return [];
      }
    })(facilityType);

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
          {[].concat(...addressString.map(e => [<br key={e}/>, e])).slice(1)}
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
