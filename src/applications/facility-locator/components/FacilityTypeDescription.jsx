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

const FacilityTypeDescription = ({ location, query }) => {
  if (location.resultItem) {
    return (
      <dfn>
        <div>
          <span>
            {facilityName(query, location) &&
              facilityName(query, location).toUpperCase()}
          </span>
        </div>
      </dfn>
    );
  }

  return (
    <p>
      <span>
        {facilityName(query, location) &&
          facilityName(query, location).toUpperCase()}
      </span>
    </p>
  );
};

export default FacilityTypeDescription;
