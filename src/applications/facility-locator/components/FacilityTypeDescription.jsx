import React from 'react';
import { facilityTypes } from '../config';

const FacilityTypeDescription = ({ location }) => {
  const { facilityType, classification } = location.attributes;
  const typeName = (facilityType === 'va_cemetery') ?
    classification :
    facilityTypes[facilityType];

  return (
    <p>
      <span><strong>Facility type:</strong> {typeName}</span>
    </p>
  );
};

export default FacilityTypeDescription;
