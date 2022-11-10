import React from 'react';

export default function FacilityDataLink({ facilityId, text }) {
  return (
    <a
      href={`https://www.accesstocare.va.gov/FacilityPerformanceData/FacilityData?stationNumber=${facilityId}`}
    >
      {text}
    </a>
  );
}
