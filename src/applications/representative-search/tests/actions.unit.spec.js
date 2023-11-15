import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/unit/helpers';

import {
  CLEAR_SEARCH_RESULTS,
  GEOCODE_CLEAR_ERROR,
} from '../utils/actionTypes';

import { clearGeocodeError, clearSearchResults } from '../actions';

describe('Actions', () => {
  describe('clearSearchResults', () => {
    it('should return the correct action object', () => {
      const action = clearSearchResults();
      expect(action).to.eql({
        type: CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe('fetchLocations', () => {
    describe('clearGeocodeError', () => {
      beforeEach(() => mockFetch());
      it('should have correct dispatch type', () => {
        const dispatch = sinon.spy();
        return clearGeocodeError()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.deep.equal(
            GEOCODE_CLEAR_ERROR,
          );
        });
      });
    });
  });
});
