import { expect } from 'chai';
import sinon from 'sinon';
import { Matchers } from '@pact-foundation/pact';

import contractTest from 'platform/testing/contract';

import {
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_SUCCESS,
  fetchSearchResults,
} from '../actions';

const { eachLike, like, string, term } = Matchers;

contractTest('Search', 'VA.gov API', mockApi => {
  describe('GET /search', () => {
    context('with at least one result', () => {
      it('responds with success', async () => {
        await mockApi().addInteraction({
          state: 'at least one matching result exists',
          uponReceiving: 'a search query',
          withRequest: {
            method: 'GET',
            path: '/v0/search',
            query: { query: 'benefits' },
            headers: {
              'X-Key-Inflection': 'camel',
            },
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': term({
                matcher: '^application/json',
                generate: 'application/json',
              }),
            },
            body: {
              data: {
                type: 'search_results_responses',
                attributes: {
                  body: {
                    query: string('benefits'),
                    web: {
                      results: eachLike({
                        title: 'string',
                        url: 'url',
                        snippet: 'a short paragraph blurb',
                      }),
                    },
                  },
                },
              },
              meta: {
                pagination: like({
                  currentPage: 1,
                  perPage: 10,
                  totalPages: 1,
                  totalEntries: 1,
                }),
              },
            },
          },
        });

        const dispatch = sinon.spy();
        await fetchSearchResults('benefits')(dispatch);

        const [firstAction] = dispatch.firstCall.args;
        expect(firstAction.type).to.eq(FETCH_SEARCH_RESULTS);

        const [secondAction] = dispatch.secondCall.args;
        expect(secondAction.type).to.eq(FETCH_SEARCH_RESULTS_SUCCESS);
        expect(secondAction.type).to.eq(1);

        expect(secondAction.results.web.results).to.have.lengthOf.at.least(1);

        secondAction.results.web.results.forEach(result =>
          expect(Object.keys(result)).to.include('title', 'url', 'snippet'),
        );
      });
    });
  });
});
