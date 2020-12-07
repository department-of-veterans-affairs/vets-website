/* eslint-disable no-case-declarations */
import camelCaseKeysRecursive from 'camelcase-keys-recursive';
import localStorage from 'platform/utilities/storage/localStorage';

import { QUERY_LIFESPAN } from '../constants';

import {
  FILTER_TOGGLED,
  SEARCH_STARTED,
  SEARCH_FAILED,
  INSTITUTION_SEARCH_SUCCEEDED,
  PROGRAM_SEARCH_SUCCEEDED,
} from '../actions';

import {
  normalizedInstitutionAttributes,
  normalizedProgramAttributes,
} from './utility';

const INITIAL_STATE = {
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
  links: {},
  results: [],
  count: null,
  version: {},
  query: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  inProgress: false,
  error: null,
  filterOpened: false,
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

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FILTER_TOGGLED:
      return { ...state, filterOpened: !state.filterOpened };
    case SEARCH_STARTED:
      const query = {
        ...action.query,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem('giQuery', JSON.stringify(query));

      return { ...state, query: action.query, inProgress: true };
    case SEARCH_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false,
        error: action.payload,
      };
    case INSTITUTION_SEARCH_SUCCEEDED:
      const camelPayload = camelCaseKeysRecursive(action.payload);
      const results = camelPayload.data.reduce((acc, result) => {
        const attributes = normalizedInstitutionAttributes(result.attributes);
        return [...acc, attributes];
      }, []);
      return {
        ...state,
        results,
        pagination: derivePaging(camelPayload.links),
        facets: normalizedInstitutionFacets(camelPayload.meta.facets),
        count: camelPayload.meta.count,
        version: camelPayload.meta.version,
        inProgress: false,
        error: null,
      };
    case PROGRAM_SEARCH_SUCCEEDED:
      const programCamelPayload = camelCaseKeysRecursive(action.payload);
      const programResults = programCamelPayload.data.reduce((acc, result) => {
        const attributes = normalizedProgramAttributes(result.attributes);
        return [...acc, attributes];
      }, []);
      return {
        ...state,
        results: programResults,
        pagination: derivePaging(programCamelPayload.links),
        facets: normalizedInstitutionFacets(programCamelPayload.meta.facets),
        count: programCamelPayload.meta.count,
        version: programCamelPayload.meta.version,
        inProgress: false,
      };
    default:
      let newState = { ...state };

      const storedQuery = JSON.parse(localStorage.getItem('giQuery'));

      if (
        storedQuery?.timestamp &&
        new Date().getTime() - storedQuery.timestamp < QUERY_LIFESPAN
      ) {
        delete storedQuery.timestamp;
        newState = {
          ...newState,
          query: { ...storedQuery },
        };
      }

      return newState;
  }
}
