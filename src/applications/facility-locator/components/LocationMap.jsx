import React from 'react';
import {
  mapboxToken,
  staticMapURL,
} from 'platform/utilities/facilities-and-mapbox';

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
