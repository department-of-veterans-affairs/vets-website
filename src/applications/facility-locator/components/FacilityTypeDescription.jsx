import React, { Component } from 'react';
import { facilityTypes } from '../config';

class FacilityTypeDescription extends Component {
  renderFacilityType() {
    const { facilityType, classification } = this.props.facility.attributes;

    return facilityType === 'va_cemetery'
      ? classification
      : facilityTypes[facilityType];
  }

  render() {
    return (
      <p>
        <span>
          <strong>Facility type:</strong> {this.renderFacilityType()}
        </span>
      </p>
    );
  }
}

export default FacilityTypeDescription;
