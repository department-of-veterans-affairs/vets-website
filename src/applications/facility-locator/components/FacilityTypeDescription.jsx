import React, { Component } from 'react';
import { facilityTypes } from '../config';

class FacilityTypeDescription extends Component {
  renderFacilityType() {
    const { facility } = this.props;
    const { facilityType, classification } = facility.attributes;

    return (facilityType === 'va_cemetery' ? classification : facilityTypes[facilityType]);
  }

  render() {
    return (
      <p>
        <span><strong>Facility type:</strong> {this.renderFacilityType()}</span>
      </p>
    );
  }
}

export default FacilityTypeDescription;
