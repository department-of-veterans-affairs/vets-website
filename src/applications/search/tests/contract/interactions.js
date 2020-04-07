import { Matchers } from '@pact-foundation/pact';

export const SEARCH_STRING = 'test';
const RESULTS_PER_PAGE = 10;

const searchResultExpectation = {
  title: 'string',
  url: 'url',
  snippet: 'a short paragraph blurb',
  publicationDate: null,
};

const expectedResponseBody = results => ({
  data: {
    type: 'search_results_responses',
    attributes: {
      body: {
        query: SEARCH_STRING,
        web: { results },
      },
    },
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: RESULTS_PER_PAGE,
      totalPages: Math.ceil((results.min || results.length) / RESULTS_PER_PAGE),
      totalEntries: results.min || results.length,
    },
  },
});

export default {
  searchWithNoResults: {
    state: 'no matching results exist',
    uponReceiving: 'a search query',
    withRequest: {
      method: 'GET',
      path: '/v0/search',
      query: { query: SEARCH_STRING },
      headers: {
        'X-Key-Inflection': 'camel',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': Matchers.term({
          matcher: '^application/json',
          generate: 'application/json; charset=utf-8',
        }),
      },
      body: expectedResponseBody([]),
    },
  },

  searchWithSingleResult: {
    state: 'a single matching result exists',
    uponReceiving: 'a search query',
    withRequest: {
      method: 'GET',
      path: '/v0/search',
      query: { query: SEARCH_STRING },
      headers: {
        'X-Key-Inflection': 'camel',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': Matchers.term({
          matcher: '^application/json',
          generate: 'application/json; charset=utf-8',
        }),
      },
      body: expectedResponseBody([searchResultExpectation]),
    },
  },

  searchWithMultipleResults: {
    state: 'multiple matching results exist',
    uponReceiving: 'a search query',
    withRequest: {
      method: 'GET',
      path: '/v0/search',
      query: { query: SEARCH_STRING },
      headers: {
        'X-Key-Inflection': 'camel',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': Matchers.term({
          matcher: '^application/json',
          generate: 'application/json; charset=utf-8',
        }),
      },
      body: expectedResponseBody(
        Matchers.eachLike(searchResultExpectation, { min: 2 }),
      ),
    },
  },
};
