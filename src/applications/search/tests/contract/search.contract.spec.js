import { expect } from 'chai';
import sinon from 'sinon';

import contractTest from 'platform/testing/contract';

import {
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_SUCCESS,
  fetchSearchResults,
} from '../../actions';

import INTERACTIONS, { SEARCH_STRING } from './interactions';

contractTest('VA.gov Search', 'VA.gov API', mockApi => {
  describe('GET /search', () => {
    context('with no results', () => {
      it('responds with success', async () => {
        await mockApi.addInteraction(INTERACTIONS.searchWithNoResults);

        const dispatch = sinon.spy();
        await fetchSearchResults(SEARCH_STRING)(dispatch);

        const [firstAction] = dispatch.firstCall.args;
        expect(firstAction.type).to.eq(FETCH_SEARCH_RESULTS);
        expect(firstAction.query).to.eq(SEARCH_STRING);

        const [secondAction] = dispatch.secondCall.args;
        expect(secondAction.type).to.eq(FETCH_SEARCH_RESULTS_SUCCESS);
        expect(secondAction.results.web.results).to.be.empty;
        expect(secondAction.meta.pagination.currentPage).to.equal(1);
        expect(secondAction.meta.pagination.totalEntries).to.equal(0);
        expect(secondAction.meta.pagination.totalPages).to.equal(0);
      });
    });

    context('with a single result', () => {
      it('responds with success', async () => {
        await mockApi.addInteraction(INTERACTIONS.searchWithSingleResult);

        const dispatch = sinon.spy();
        await fetchSearchResults(SEARCH_STRING)(dispatch);

        const [firstAction] = dispatch.firstCall.args;
        expect(firstAction.type).to.eq(FETCH_SEARCH_RESULTS);
        expect(firstAction.query).to.eq(SEARCH_STRING);

        const [secondAction] = dispatch.secondCall.args;
        expect(secondAction.type).to.eq(FETCH_SEARCH_RESULTS_SUCCESS);
        expect(secondAction.results.web.results).to.have.lengthOf(1);

        expect(Object.keys(secondAction.results.web.results[0])).to.include(
          'title',
          'url',
          'snippet',
        );

        expect(secondAction.meta.pagination.currentPage).to.equal(1);
        expect(secondAction.meta.pagination.totalEntries).to.equal(1);
        expect(secondAction.meta.pagination.totalPages).to.equal(1);
      });
    });

    context('with multiple results', () => {
      it('responds with success', async () => {
        await mockApi.addInteraction(INTERACTIONS.searchWithMultipleResults);

        const dispatch = sinon.spy();
        await fetchSearchResults(SEARCH_STRING)(dispatch);

        const [firstAction] = dispatch.firstCall.args;
        expect(firstAction.type).to.eq(FETCH_SEARCH_RESULTS);
        expect(firstAction.query).to.eq(SEARCH_STRING);

        const [secondAction] = dispatch.secondCall.args;
        expect(secondAction.type).to.eq(FETCH_SEARCH_RESULTS_SUCCESS);
        expect(secondAction.results.web.results).to.have.lengthOf.at.least(2);

        secondAction.results.web.results.forEach(result =>
          expect(Object.keys(result)).to.include('title', 'url', 'snippet'),
        );

        expect(secondAction.meta.pagination.currentPage).to.equal(1);

        expect(secondAction.meta.pagination.totalEntries).to.equal(
          secondAction.results.web.results.length,
        );

        expect(secondAction.meta.pagination.totalPages).to.equal(1);
      });
    });
  });
});
