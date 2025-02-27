/* eslint-disable no-console */
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import {
  isPostcode,
  MAPBOX_QUERY_TYPES,
  CountriesList,
  mapboxClient,
} from 'platform/utilities/facilities-and-mapbox';
import {
  BOUNDING_RADIUS,
  EXPANDED_BOUNDING_RADIUS,
  LocationType,
  MIN_RADIUS_CCP,
  MIN_RADIUS_EXP,
  MIN_RADIUS_NCA,
} from '../../constants';
import {
  GEOCODE_STARTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
} from '../actionTypes';
import { radiusFromBoundingBox } from '../../utils/facilityDistance';

const mbxClient = mbxGeo(mapboxClient);

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const genBBoxFromAddress = (
  query,
  expandedRadius = false,
  useProgressiveDisclosure = false,
) => {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!query.searchString) {
    return {
      type: SEARCH_FAILED,
      error: 'Empty search string/address. Search cancelled.',
    };
  }

  return dispatch => {
    dispatch({ type: GEOCODE_STARTED });

    // commas can be stripped from query if Mapbox is returning unexpected results
    let types = MAPBOX_QUERY_TYPES;
    if (isPostcode(query.searchString?.trim() || '')) {
      types = ['postcode'];
    }
    mbxClient
      .forwardGeocode({
        countries: CountriesList,
        types,
        autocomplete: false, // set this to true when build the predictive search UI (feature-flipped)
        query: query.searchString,
        proximity: 'ip',
      })
      .send()
      .then(({ body: { features } }) => {
        const zip =
          features[0].context?.find(v => v.id.includes('postcode')) || {};
        const coordinates = features[0].center;
        const zipCode = zip.text || features[0].place_name;
        // [[minLon,minLat],[maxLon,maxLat]]
        const featureBox = features[0].box;
        dispatch({
          type: GEOCODE_COMPLETE,
          payload: query.usePredictiveGeolocation
            ? features.map(feature => ({
                placeName: feature.place_name,
                placeType: feature.place_type[0],
                bbox: feature.bbox,
                center: feature.center,
              }))
            : [],
        });

        let searchBoundingRadiusLat = expandedRadius
          ? EXPANDED_BOUNDING_RADIUS
          : BOUNDING_RADIUS;
        let searchBoundingRadiusLong = searchBoundingRadiusLat;
        if (query.facilityType === LocationType.CEMETERY && coordinates) {
          const [, lat] = coordinates;
          searchBoundingRadiusLat = MIN_RADIUS_NCA / 69;
          searchBoundingRadiusLong = MIN_RADIUS_NCA / (69 * Math.cos(lat));
        } else if (
          query.facilityType === LocationType.CC_PROVIDER &&
          coordinates
        ) {
          // console.log('HEREZXZX');
          const [, lat] = coordinates;
          searchBoundingRadiusLat = MIN_RADIUS_CCP / 69;
          searchBoundingRadiusLong = MIN_RADIUS_CCP / (69 * Math.cos(lat));
          // console.log('HEREZXZX', {
          //   searchBoundingRadiusLat,
          //   searchBoundingRadiusLong,
          // });
        } else if (useProgressiveDisclosure && coordinates) {
          const [, lat] = coordinates;
          searchBoundingRadiusLat = MIN_RADIUS_EXP / 69;
          searchBoundingRadiusLong = MIN_RADIUS_EXP / (69 * Math.cos(lat));
        }

        // console.log('searchBoundingRadiusLat', searchBoundingRadiusLat);
        // console.log('searchBoundingRadiusLong', searchBoundingRadiusLong);
        let minBounds = [
          coordinates[0] - searchBoundingRadiusLong,
          coordinates[1] - searchBoundingRadiusLat,
          coordinates[0] + searchBoundingRadiusLong,
          coordinates[1] + searchBoundingRadiusLat,
        ];

        if (featureBox) {
          minBounds = [
            Math.min(featureBox[0], coordinates[0] - searchBoundingRadiusLong),
            Math.min(featureBox[1], coordinates[1] - searchBoundingRadiusLat),
            Math.max(featureBox[2], coordinates[0] + searchBoundingRadiusLong),
            Math.max(featureBox[3], coordinates[1] + searchBoundingRadiusLat),
          ];
        }
        const [radius] = radiusFromBoundingBox(
          [{ ...features[0], bbox: minBounds }],
          query?.facilityType,
          useProgressiveDisclosure,
        );
        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            radius,
            context: zipCode,
            id: Date.now(),
            inProgress: true,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
            searchCoords: {
              lat: features[0].geometry.coordinates[1],
              lng: features[0].geometry.coordinates[0],
            },
            bounds: minBounds,
            zoomLevel: features[0].id.split('.')[0] === 'region' ? 7 : 9,
            currentPage: 1,
            mapBoxQuery: {
              placeName: features[0].place_name,
              placeType: features[0].place_type[0],
            },
            searchArea: null,
          },
        });

        console.log('DONE');
      })
      .catch(_e => {
        console.log({ _e });
        dispatch({ type: GEOCODE_FAILED });
        dispatch({ type: SEARCH_FAILED, error: { type: 'mapBox' } });
      });
  };
};
