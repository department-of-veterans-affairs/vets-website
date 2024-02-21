import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxClient from '../../components/mapbox/MapboxClient';
import {
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  GEOCODE_FAILED,
} from '../../utils/actionTypes';
import { MAPBOX_QUERY_TYPES, CountriesList } from '../../constants';
import { distBetween } from '../../utils/representativeDistance';

const mbxClient = mbxGeo(mapboxClient);

/**
 * Calculates a human readable location (address, zip, city, state) updated
 * from the coordinates center of the map
 */
export const genSearchAreaFromCenter = query => {
  const { lat, lng, currentBounds } = query;
  return dispatch => {
    const types = MAPBOX_QUERY_TYPES;
    mbxClient
      .reverseGeocode({
        countries: CountriesList,
        types,
        query: [lng, lat],
      })
      .send()
      .then(({ body: { features } }) => {
        const zip =
          features[0].context.find(v => v.id.includes('postcode')) || {};
        const location = zip.text || features[0].place_name;

        // Radius is computed as the distance from the center point
        // to the western edge of the bounding box
        const radius = distBetween(lat, lng, lat, currentBounds[0]);

        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            radius,
            locationInputString: location,
            context: location,
            searchArea: {
              locationString: location,
              locationCoords: {
                lng,
                lat,
              },
            },
            mapBoxQuery: {
              placeName: features[0].place_name,
              placeType: features[0].place_type[0],
            },
            searchCoords: null,
            bounds: currentBounds,
            position: {
              latitude: lat,
              longitude: lng,
            },
          },
        });
      })
      .catch(_ => {
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
      });
  };
};
