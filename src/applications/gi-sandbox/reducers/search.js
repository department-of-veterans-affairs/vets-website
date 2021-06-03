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
  UPDATE_CURRENT_SEARCH_TAB,
} from '../actions';
import { normalizedInstitutionAttributes } from '../../gi/reducers/utility';
import { TABS } from '../constants';

const INITIAL_STATE = {
  error: null,
  geocode: null,
  geocodeInProgress: false,
  geolocationInProgress: false,
  inProgress: false,
  location: {
    count: null,
    facets: {
      category: {},
      type: {},
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
      type: {},
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
    distance: '50',
    latitude: null,
    longitude: null,
  },
  compare: {
    results: [],
    count: null,
  },
  tab: TABS.name,
};

function uppercaseKeys(obj) {
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [key.toUpperCase()]: obj[key],
    }),
    {},
  );
}

function normalizedInstitutionFacets(facets) {
  const state = uppercaseKeys(facets.state);
  const type = uppercaseKeys(facets.type);
  const provider = Array.isArray(facets.provider)
    ? facets.provider.map(providerCount => ({
        ...providerCount,
        name: providerCount.name.toUpperCase(),
      }))
    : [];

  return { ...facets, state, type, provider };
}

function derivePaging(links) {
  const selfPage = links.self.match(/page=(\d+)/i);
  const currentPage = Number(selfPage === null ? 1 : selfPage[1]);
  const totalPages = Number(links.last.match(/page=(\d+)/i)[1]);
  const perPage = Number(links.last.match(/per_page=(\d+)/i)[1]);
  return { currentPage, totalPages, perPage };
}

function buildSearchResults(payload, paging = true) {
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
  switch (action.type) {
    case UPDATE_CURRENT_SEARCH_TAB:
      return {
        ...state,
        tab: action.tab,
      };

    case SEARCH_BY_LOCATION_SUCCEEDED:
      return {
        ...state,
        location: buildSearchResults(action.payload, false),
        inProgress: false,
        error: null,
      };

    case SEARCH_BY_NAME_SUCCEEDED:
      return {
        ...state,
        name: buildSearchResults(action.payload),
        inProgress: false,
        error: null,
      };

    case SEARCH_STARTED:
      return {
        ...state,
        query: {
          ...state.query,
          name: action.payload.name,
          location: action.payload.location,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        },
        inProgress: true,
      };

    case SEARCH_FAILED:
      return {
        ...state,
        inProgress: false,
        error: action.payload,
      };

    case GEOCODE_STARTED:
      return {
        ...state,
        query: { ...state.query, ...action.payload },
        geocodeInProgress: true,
      };

    case GEOCODE_SUCCEEDED:
      return { ...state, geocode: action.payload, geocodeInProgress: false };

    case GEOCODE_FAILED:
      return {
        ...state,
        error: action.payload,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };

    case SEARCH_BY_FACILITY_CODES_SUCCEEDED:
      return {
        ...state,
        compare: buildSearchResults(action.payload, false),
        inProgress: false,
        error: null,
      };

    default:
      return { ...state };
  }
}
