import { expect } from 'chai';
import sinon from 'sinon-v20';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_TEXT,
  SEARCH_QUERY_UPDATED,
} from '../../actions/actionTypes';
import {
  clearSearchResults,
  clearSearchText,
  updateSearchQuery,
} from '../../actions/search';

describe('actions: search', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('clearSearchResults', () => {
    it('should return the correct action object', () => {
      const action = clearSearchResults();
      expect(action).to.eql({
        type: CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe('clearSearchText', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should have correct dispatch type', () => {
      const dispatch = sinon.spy();

      return clearSearchText()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.deep.equal(
          CLEAR_SEARCH_TEXT,
        );
      });
    });
  });

  describe('updateSearchQuery', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fail if no query searchString', () => {
      const query = {
        searchString: 'test',
      };

      const action = updateSearchQuery(query);

      expect(action).to.eql({
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
        },
      });
    });
  });
});
