import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';

import {
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_LOCATION_DETAIL,
  FETCH_SPECIALTIES,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_TEXT,
  GEOCODE_CLEAR_ERROR,
  MAP_MOVED,
} from '../actions/actionTypes';

import {
  clearGeocodeError,
  clearSearchResults,
  clearSearchText,
  fetchProviderDetail,
  fetchVAFacility,
  genBBoxFromAddress,
  getProviderSpecialties,
  mapMoved,
  updateSearchQuery,
} from '../actions';

describe('Actions', () => {
  describe('clearSearchResults', () => {
    it('should return the correct action object', () => {
      const action = clearSearchResults();
      expect(action).to.eql({
        type: CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe('fetchVAFacility', () => {
    beforeEach(() => mockFetch());
    it('should return the correct action object when location is given', () => {
      const action = fetchVAFacility(null, true);
      expect(action).to.eql({
        type: FETCH_LOCATION_DETAIL,
        payload: true,
      });
    });

    it('should dispatch type SEARCH_STARTED on initiation', () => {
      const dispatch = sinon.spy();
      return fetchVAFacility()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.deep.equal(SEARCH_STARTED);
      });
    });
  });

  describe('fetchLocations', () => {
    it('should return allCare when isAllCare', () => {
      const locationType = {
        URGENT_CARE: true,
      };
      const dispatch = sinon.spy();
      const returnAllCare = sinon.spy();
      return fetchVAFacility(
        null,
        null,
        locationType,
        'AllUrgentCare',
        null,
        dispatch,
        null,
        null,
      )(dispatch).then(() => {
        expect(returnAllCare.called);
      });
    });

    describe('fetchProviderDetail', () => {
      beforeEach(() => mockFetch());
      it('should have correct dispatch type', () => {
        const dispatch = sinon.spy();
        return fetchProviderDetail()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.deep.equal(SEARCH_STARTED);
        });
      });
    });

    describe('getProviderSpecialties', () => {
      beforeEach(() => mockFetch());
      it('should have correct dispatch type', () => {
        const dispatch = sinon.spy();
        return getProviderSpecialties()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.deep.equal(
            FETCH_SPECIALTIES,
          );
        });
      });
    });

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

    describe('genBBoxFromAddress', () => {
      beforeEach(() => mockFetch());
      it('should fail if no query searchString', () => {
        const query = {
          searchString: null,
        };
        const action = genBBoxFromAddress(query, null);
        expect(action).to.eql({
          type: SEARCH_FAILED,
          error: 'Empty search string/address. Search cancelled.',
        });
      });
    });

    describe('mapMoved', () => {
      beforeEach(() => mockFetch());
      it('should return the correct action object when location is given', () => {
        const action = mapMoved(100);
        expect(action).to.eql({
          type: MAP_MOVED,
          currentRadius: 100,
        });
      });
    });

    describe('clearSearchText', () => {
      beforeEach(() => mockFetch());
      it('should have correct dispatch type', () => {
        const dispatch = sinon.spy();
        return clearSearchText()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.deep.equal(
            CLEAR_SEARCH_TEXT,
          );
        });
      });
    });

    describe('genBBoxFromAddress', () => {
      beforeEach(() => mockFetch());
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
});
