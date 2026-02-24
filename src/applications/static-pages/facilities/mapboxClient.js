import MapboxClient from '@mapbox/mapbox-sdk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  CountriesList,
  MAPBOX_QUERY_TYPES,
} from 'platform/utilities/facilities-and-mapbox';
import { mapboxToken } from './mapboxToken';

// Fallback token is a structurally valid placeholder so the SDK doesn't throw
// at module load time when no real token is set (e.g. unit tests in CI).
const mapboxClient = new MapboxClient({
  accessToken: mapboxToken || 'pk.eyJ1IjoicGxhY2Vob2xkZXIifQ==',
});

const mbxClient = mbxGeo(mapboxClient);

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
