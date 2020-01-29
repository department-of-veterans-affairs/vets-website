import React from 'react';
import { facilityTypes } from '../config';

const FacilityTypeDescription = ({ location, from }) => {
  const { facilityType, classification } = location.attributes;
  const typeName =
    facilityType === 'va_cemetery'
      ? classification
      : facilityTypes[facilityType];

  return (
    <p>
      <span>
        {from === 'SearchResult' ? (
          <span>{typeName.toUpperCase()}</span>
        ) : (
          <span>
            <strong>Facility type:</strong> {typeName}
          </span>
        )}
      </span>
    </p>
  );
};

export default FacilityTypeDescription;
