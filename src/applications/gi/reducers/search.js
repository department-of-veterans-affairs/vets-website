import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_BY_FACILITY_CODES_SUCCEEDED,
  SEARCH_BY_LOCATION_SUCCEEDED,
  SEARCH_BY_NAME_SUCCEEDED,
  GEOCODE_SUCCEEDED,
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_LOCATION_FAILED,
  GEOLOCATE_USER,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
  MAP_CHANGED,
  UPDATE_CURRENT_SEARCH_TAB,
  UPDATE_QUERY_PARAMS,
} from '../actions';
import { normalizedInstitutionAttributes } from './utility';
import { TABS } from '../constants';

export const INITIAL_STATE = {
  error: null,
  geocode: null,
  geolocationInProgress: false,
  inProgress: false,
  location: {
    count: null,
    facets: {
      category: {},
      state: {},
      country: [],
      cautionFlag: {},
      studentVetGroup: {},
      yellowRibbonScholarship: {},
      principlesOfExcellence: {},
      eightKeysToVeteranSuccess: {},
      stem: {},
      provider: [],
    },
    results: [],
  },
  name: {
    count: null,
    facets: {
      category: {},
      state: {},
      country: [],
      cautionFlag: {},
      studentVetGroup: {},
      yellowRibbonScholarship: {},
      principlesOfExcellence: {},
      eightKeysToVeteranSuccess: {},
      stem: {},
      provider: [],
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
    results: [],
  },
  query: {
    name: '',
    location: '',
    distance: '25',
    latitude: null,
    longitude: null,
    streetAddress: {
      searchString: '',
      position: {},
    },
    mapState: { changed: false, distance: null },
  },
  compare: {
    results: [],
    count: null,
  },
  tab: TABS.name,
  loadFromUrl: false,
};

export function uppercaseKeys(obj) {
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [key.toUpperCase()]: obj[key],
    }),
    {},
  );
}

export function normalizedInstitutionFacets(facets) {
  const state = uppercaseKeys(facets.state);
  const provider = Array.isArray(facets.provider)
    ? facets.provider.map(providerCount => ({
        ...providerCount,
        name: providerCount.name.toUpperCase(),
      }))
    : [];

  return { ...facets, state, provider };
}

export function derivePaging(links) {
  const selfPage = links.self.match(/page=(\d+)/i);
  const currentPage = Number(selfPage === null ? 1 : selfPage[1]);
  const totalPages = Number(links.last.match(/page=(\d+)/i)[1]);
  const perPage = Number(links.last.match(/per_page=(\d+)/i)[1]);
  return { currentPage, totalPages, perPage };
}

export function buildSearchResults(payload, paging = true) {
  const camelPayload = camelCaseKeysRecursive(payload);
  return {
    results: camelPayload.data.reduce((acc, result) => {
      const attributes = normalizedInstitutionAttributes(result.attributes);
      return [...acc, attributes];
    }, []),
    pagination: paging ? derivePaging(camelPayload.links) : undefined,
    facets: normalizedInstitutionFacets(camelPayload.meta.facets),
    count: camelPayload.meta.count,
  };
}

export default function(state = INITIAL_STATE, action) {
  const newState = {
    ...state,
    loadFromUrl: false, // set this to false anytime a user action happens
  };

  switch (action.type) {
    case UPDATE_CURRENT_SEARCH_TAB:
      return {
        ...newState,
        tab: action.tab,
        error: null,
      };

    case SEARCH_BY_LOCATION_SUCCEEDED:
      return {
        ...newState,
        location: buildSearchResults(action.payload, false),
        inProgress: false,
        error: null,
      };

    case SEARCH_BY_NAME_SUCCEEDED:
      return {
        ...newState,
        name: buildSearchResults(action.payload),
        inProgress: false,
        error: null,
      };

    case SEARCH_STARTED:
      return {
        ...newState,
        query: {
          ...newState.query,
          name: action.payload.name || newState.query.name,
          location: action.payload.location || newState.query.location,
          distance: action.payload.distance || newState.query.distance,
          latitude: action.payload.latitude || newState.query.latitude,
          longitude: action.payload.longitude || newState.query.longitude,
        },
        inProgress: true,
      };

    case SEARCH_FAILED:
      return {
        ...newState,
        inProgress: false,
        error: action.payload,
      };

    case GEOCODE_STARTED:
      return {
        ...newState,
        query: { ...newState.query, ...action.payload },
        geocodeInProgress: true,
      };
    case GEOCODE_FAILED:
      return {
        ...newState,
        error: true,
        geocodeError: action.code,
        geolocationInProgress: false,
      };
    case GEOCODE_COMPLETE:
      return {
        ...newState,
        geolocationInProgress: false,
        query: {
          ...newState.query,
          streetAddress: {
            searchString: action.payload.searchString,
            position: { ...action.payload.position },
          },
        },
        error: false,
      };
    case GEOCODE_CLEAR_ERROR:
      return {
        ...newState,
        error: false,
        geocodeError: 0,
        geolocationInProgress: false,
      };

    case GEOCODE_SUCCEEDED:
      return { ...newState, geocode: action.payload, geocodeInProgress: false };

    case GEOCODE_LOCATION_FAILED:
      return {
        ...newState,
        error: action.payload,
        geocodeError: action.code,
        geolocationInProgress: false,
      };
    case GEOLOCATE_USER:
      return {
        ...newState,
        geolocationInProgress: true,
        query: {
          ...newState.query,
          streetAddress: {
            searchString: '',
            position: {},
          },
        },
      };

    case SEARCH_BY_FACILITY_CODES_SUCCEEDED:
      return {
        ...newState,
        compare: buildSearchResults(action.payload, false),
        inProgress: false,
        error: null,
      };

    case UPDATE_QUERY_PARAMS:
      return {
        ...newState,
        tab: action.payload.search || newState.tab,
        query: {
          ...newState.query,
          name: action.payload.name || newState.query.name,
          location: action.payload.location || newState.query.location,
          distance: action.payload.distance || newState.query.distance,
        },
        name: {
          ...newState.name,
          pagination: {
            ...newState.name.pagination,
            currentPage:
              action.payload.page || newState.name.pagination.currentPage,
          },
        },
        loadFromUrl: true,
      };

    case MAP_CHANGED:
      return {
        ...newState,
        query: {
          ...newState.query,
          mapState: { ...newState.query.mapState, ...action.payload },
        },
      };

    default:
      return { ...state };
  }
}
