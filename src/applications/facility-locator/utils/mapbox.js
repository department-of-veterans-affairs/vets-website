import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../components/MapboxClient';

const mbxClient = mbxGeo(mapboxClient);
import { CountriesList, MAPBOX_QUERY_TYPES } from '../constants';

const getFeaturesFromAddress = query => {
  return new Promise(resolve => {
    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types: MAPBOX_QUERY_TYPES,
        autocomplete: false,
        query,
      })
      .send()
      .then(features => {
        resolve(features);
      });
  });
};

export { getFeaturesFromAddress };
