import React from 'react';
import { facilityTypes } from '../config';

const facilityName = (query, location) => {
  const { facilityType, classification } = location.attributes;
  let name;
  if (query && query.facilityType === 'urgent_care') {
    name = 'VA URGENT CARE';
  } else {
    name =
      facilityType === 'va_cemetery'
        ? classification
        : facilityTypes[facilityType];
  }
  return name;
};

const FacilityTypeDescription = ({ location, from, query }) => (
  <p>
    <span>
      {from === 'SearchResult' ? (
        <span>{facilityName(query, location).toUpperCase()}</span>
      ) : (
        <span>
          <strong>Facility type:</strong> {facilityName(query, location)}
        </span>
      )}
    </span>
  </p>
);

export default FacilityTypeDescription;
