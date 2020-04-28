import { mapboxToken } from '../utils/mapboxToken';
import environment from 'platform/utilities/environment';
import React from 'react';
import { LocationType, PinNames } from '../constants';

function LocationMap({ info }) {
  if (!info) {
    return <div />;
  }

  const {
    type,
    attributes: { lat, long, facilityType },
  } = info;

  const pinName =
    type === LocationType.CC_PROVIDER ? PinNames[type] : PinNames[facilityType];

  const pinURL = encodeURIComponent(
    `${environment.BASE_URL}/img/icons/${pinName}-pin.png`,
  );

  const mapUrl = `https://api.mapbox.com/v4/mapbox.streets/url-${pinURL}(${long},${lat})/${long},${lat},16/500x300.png?access_token=${mapboxToken}`;

  return (
    <div className="mb2">
      <h3 className="highlight">View on Map</h3>
      <img src={mapUrl} alt="Static map" />
    </div>
  );
}

export default LocationMap;
