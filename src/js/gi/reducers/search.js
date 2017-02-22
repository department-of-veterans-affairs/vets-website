import { SEARCH_STARTED, SEARCH_FAILED, SEARCH_SUCCEEDED } from '../actions';

const INITIAL_STATE = {
  facets: {
    type: {},
    type_name: {},
    state: {},
    country: {},
    caution_flag: {},
    student_vet_group: {},
    yellow_ribbon_scholarship: {},
    principles_of_excellence: {},
    eight_keys_to_veteran_success: {},
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
      [key.toUpperCase()]: obj[key]
    };
  }, {});
}

function normalizedFacets(facets) {
  const state = uppercaseKeys(facets.state);
  const country = uppercaseKeys(facets.country);
  const type_name = uppercaseKeys(facets.type_name);
  return {
    ...facets,
    state,
    country,
    type_name
  };
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
      const results = action.payload.data.reduce((results, result) => {
        const attributes = normalizedAttributes(result.attributes);
        return [...results, attributes];
      }, []);
      return {
        ...state,
        results,
        pagination: derivePaging(action.payload.links),
        facets: normalizedFacets(action.payload.meta.facets),
        count: action.payload.meta.count,
        version: action.payload.meta.version,
        inProgress: false
      };
    default:
      return state;
  }
}
