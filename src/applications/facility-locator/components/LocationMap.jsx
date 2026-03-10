import React from 'react';
import { staticMapURL } from 'platform/utilities/facilities-and-mapbox';
import { mapboxToken } from '../utils/mapboxToken';

function LocationMap({ info }) {
  if (!info) {
    return <div />;
  }

  const {
    attributes: { lat, long },
  } = info;

  const mapUrl = staticMapURL(lat, long, mapboxToken);

  return (
    <div className="vads-u-margin-bottom--4">
      <h3>View on map</h3>
      <img src={mapUrl} alt="Static map" />
    </div>
  );
}

export default LocationMap;
