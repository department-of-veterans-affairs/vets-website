import React from 'react';
import PropTypes from 'prop-types';
import {
  mapboxToken,
  staticMapURL,
} from 'platform/utilities/facilities-and-mapbox';
import { LatLongAbbrTypes } from '../types';

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
      <h3 className="highlight">View on map</h3>
      <img src={mapUrl} alt="Static map" />
    </div>
  );
}

LocationMap.propTypes = {
  info: PropTypes.shape({
    attributes: {
      LatLongAbbrTypes,
    },
  }),
};

export default LocationMap;
