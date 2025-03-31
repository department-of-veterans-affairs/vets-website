import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import { compact, isEmpty } from 'lodash';

export const isPostcode = qs => /^\d{5}$/.test(qs);

export const mapboxToken =
  process.env.MAPBOX_TOKEN ||
  'pk.eyJ1IjoiYWRob2MiLCJhIjoiY2wyZjNwM3dxMDZ4YjNjbzVwbTZ5aWQ1dyJ9.D8TZ1a4WobqcdYLWntXV_w';

export const mapboxClient = new MapboxClient({ accessToken: mapboxToken });
export const mbxClient = mbxGeo(mapboxClient);

export const CountriesList = ['us', 'pr', 'ph', 'gu', 'as', 'mp', 'vi'];

// Mapbox API request types
export const MAPBOX_QUERY_TYPES = [
  'place',
  'region',
  'postcode',
  'locality',
  'country',
  'neighborhood',
];

export const getFeaturesFromAddress = query => {
  return new Promise(resolve => {
    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types: MAPBOX_QUERY_TYPES,
        autocomplete: false,
        query,
        proximity: 'ip',
      })
      .send()
      .then(features => {
        resolve(features);
      });
  });
};

export const toRadians = value => {
  return (value * Math.PI) / 180;
};

const toDegrees = value => {
  return (value * 180) / Math.PI;
};

export const calculateBoundingBox = (lat, long, radius) => {
  const earthRadius = 3959;
  const radDist = radius / earthRadius;
  const radLat = toRadians(lat);
  const radLong = toRadians(long);

  // The space between lines of longitude differs depending on where you are
  // on Earth, this takes that into account
  const deltaLongitude = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  const minLongitude = radLong - deltaLongitude;
  const maxLongitude = radLong + deltaLongitude;
  const minLatitude = radLat - radDist;
  const maxLatitude = radLat + radDist;

  // facilities API wants minLong, minLat, maxLong, maxLat

  return [
    toDegrees(minLongitude).toFixed(3),
    toDegrees(minLatitude).toFixed(3),
    toDegrees(maxLongitude).toFixed(3),
    toDegrees(maxLatitude).toFixed(3),
  ];
};

export const titleCase = str => {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const buildAddressArray = (location, titleCaseText = false) => {
  if (location && location.type === 'provider') {
    const { address } = location.attributes;

    if (!isEmpty(address)) {
      return compact([
        titleCaseText ? titleCase(address.street) : address.street,
        address.appt,
        `${titleCaseText ? titleCase(address.city) : address.city}, ${
          address.state
        } ${address.zip}`,
      ]);
    }

    return [];
  }

  if (location?.attributes?.address?.physical) {
    const {
      address: { physical: address },
    } = location.attributes;

    return compact([
      titleCaseText ? titleCase(address.address1) : address.address1,
      titleCaseText ? titleCase(address.address2) : address.address2,
      titleCaseText ? titleCase(address.address3) : address.address3,
      `${titleCaseText ? titleCase(address.city) : address.city}, ${
        address.state
      } ${address.zip}`,
    ]);
  }

  return '';
};

export const staticMapURL = (lat, long, mbToken) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+d83933(${long},${lat})/${long},${lat},16/500x300?access_token=${mbToken}`;
