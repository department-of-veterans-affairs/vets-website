import React from 'react';

export default function FacilityDataLink({ facilityId, text }) {
  return (
    <va-link
      href={`https://www.accesstocare.va.gov/FacilityPerformanceData/FacilityData?stationNumber=${facilityId}`}
      text={text}
    />
  );
}
