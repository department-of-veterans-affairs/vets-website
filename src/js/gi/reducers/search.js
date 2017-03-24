/* eslint-disable no-case-declarations */
import { camelCase } from 'lodash';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';
import { SEARCH_STARTED, SEARCH_FAILED, SEARCH_SUCCEEDED } from '../actions';

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
  },
  links: {},
  results: [],
  count: null,
  version: {},
  pagination: {
    currentPage: 1,
    totalPages: 1
  },
  inProgress: false,
};

function normalizedAttributes(attributes) {
  const name = attributes.name ? attributes.name.toUpperCase() : attributes.name;
  const city = attributes.city ? attributes.city.toUpperCase() : attributes.city;
  const state = attributes.state ? attributes.state.toUpperCase() : attributes.state;
  return {
    ...attributes,
    name,
    city,
    state,
  };
}

function uppercaseKeys(obj) {
  return Object.keys(obj).reduce((result, key) => {
    return {
      ...result,
      [key.toUpperCase().replace(/_/g, '-')]: obj[key]
    };
  }, {});
}

function normalizedFacets(facets) {
  const state = uppercaseKeys(facets.state);
  const type = uppercaseKeys(facets.type);
  return { ...facets, state, type };
}

function derivePaging(links) {
  const selfPage = links.self.match(/page=(\d+)/i);
  const currentPage = Number(selfPage === null ? 1 : selfPage[1]);
  const totalPages = Number(links.last.match(/page=(\d+)/i)[1]);
  const perPage = Number(links.last.match(/per_page=(\d+)/i)[1]);
  return { currentPage, totalPages, perPage };
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        inProgress: true
      };
    case SEARCH_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false
      };
    case SEARCH_SUCCEEDED:
      const { payload: { meta: { facets } } } = action;
      const camelPayload = camelCaseKeysRecursive(action.payload);

      // In order to properly use facets for filtering, we need to
      // keep the values from the original payload without any case conversion.
      Object.keys(facets).forEach(facet => {
        const camelFacet = camelCase(facet);
        camelPayload.meta.facets[camelFacet] = facets[facet];
      });

      const results = camelPayload.data.reduce((acc, result) => {
        const attributes = normalizedAttributes(result.attributes);
        return [...acc, attributes];
      }, []);
      return {
        ...state,
        results,
        pagination: derivePaging(camelPayload.links),
        facets: normalizedFacets(camelPayload.meta.facets),
        count: camelPayload.meta.count,
        version: camelPayload.meta.version,
        inProgress: false
      };
    default:
      return state;
  }
}
