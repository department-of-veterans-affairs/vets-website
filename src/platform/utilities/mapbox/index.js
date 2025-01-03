import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';

export const mapboxToken =
  process.env.MAPBOX_TOKEN ||
  'pk.eyJ1IjoiYWRob2MiLCJhIjoiY2wyZjNwM3dxMDZ4YjNjbzVwbTZ5aWQ1dyJ9.D8TZ1a4WobqcdYLWntXV_w';

export const mapboxClient = new MapboxClient({ accessToken: mapboxToken });

const mbxClient = mbxGeo(mapboxClient);
export const CountriesList = ['us', 'pr', 'ph', 'gu', 'as', 'mp', 'vi'];

// Mapbox API request types
export const MAPBOX_QUERY_TYPES = [
  'place',
  'region',
  'postcode',
  'locality',
  'country',
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
