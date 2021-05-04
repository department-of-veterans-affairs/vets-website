import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_BY_LOCATION_SUCCEEDED,
  SEARCH_BY_NAME_SUCCEEDED,
} from '../actions';
import { normalizedInstitutionAttributes } from '../../gi/reducers/utility';

const INITIAL_STATE = {
  results: [],
  count: null,
  version: {},
  query: { name: '', location: '' },
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  inProgress: false,
  error: null,
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

function buildSearchResults(payload) {
  const camelPayload = camelCaseKeysRecursive(payload);
  return {
    results: camelPayload.data.reduce((acc, result) => {
      const attributes = normalizedInstitutionAttributes(result.attributes);
      return [...acc, attributes];
    }, []),
    pagination: derivePaging(camelPayload.links),
    facets: normalizedInstitutionFacets(camelPayload.meta.facets),
    count: camelPayload.meta.count,
    version: camelPayload.meta.version,
  };
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_BY_LOCATION_SUCCEEDED:
      return { ...state, inProgress: false };

    case SEARCH_BY_NAME_SUCCEEDED:
      return {
        ...state,
        ...buildSearchResults(action.payload),
        inProgress: false,
        error: null,
      };

    case SEARCH_STARTED:
      return { ...state, query: action.payload, inProgress: true };

    case SEARCH_FAILED:
      return {
        ...state,
        inProgress: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
}
