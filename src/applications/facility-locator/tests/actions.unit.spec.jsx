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
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES_DONE,
  FETCH_SPECIALTIES_FAILED,
} from '../actions/actionTypes';

import {
  clearGeocodeError,
  clearSearchResults,
  clearSearchText,
  fetchVAFacility,
  genBBoxFromAddress,
  getProviderSpecialties,
  mapMoved,
  updateSearchQuery,
  fetchLocations,
} from '../actions';

import { LocationType } from '../constants';
import LocatorApi from '../api';

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

    it('should handle successful API response', async () => {
      const mockData = {
        data: {
          id: '123',
          attributes: {
            name: 'Test Facility',
            lat: 40.7128,
            long: -74.006,
          },
        },
      };

      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'fetchVAFacility').resolves(mockData);

      await fetchVAFacility('123')(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(SEARCH_STARTED);
      expect(dispatch.getCall(1).args[0]).to.deep.equal({
        type: FETCH_LOCATION_DETAIL,
        payload: mockData.data,
      });
      LocatorApi.fetchVAFacility.restore();
    });

    it('should handle API errors', async () => {
      const error = new Error('An API Error');
      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'fetchVAFacility').rejects(error);

      await fetchVAFacility('123')(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(SEARCH_STARTED);
      expect(dispatch.getCall(1).args[0].type).to.equal(SEARCH_FAILED);
      expect(dispatch.getCall(1).args[0].error.message).to.equal(
        'An API Error',
      );
      LocatorApi.fetchVAFacility.restore();
    });

    it('should handle API response with errors', async () => {
      const mockData = {
        data: null,
        errors: ['ERRORS API Error'],
      };

      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'fetchVAFacility').resolves(mockData);

      await fetchVAFacility('123')(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(SEARCH_STARTED);
      expect(dispatch.getCall(1).args[0].type).to.equal(SEARCH_FAILED);
      expect(dispatch.getCall(1).args[0].error[0]).to.equal('ERRORS API Error');
      LocatorApi.fetchVAFacility.restore();
    });
  });

  describe('fetchLocations', () => {
    let dispatch;
    const mockBounds = [[0, 0], [1, 1]];
    const mockCenter = [0.5, 0.5];
    const mockRadius = 50;

    beforeEach(() => {
      dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'searchWithBounds');
    });

    afterEach(() => {
      LocatorApi.searchWithBounds.restore();
    });

    it('should handle urgent care search with AllUrgentCare service type', async () => {
      const mockVaData = {
        data: [
          {
            attributes: { lat: 0.5, long: 0.5 },
            distance: 0,
          },
        ],
      };
      const mockNonVaData = {
        data: [
          {
            attributes: { lat: 0.6, long: 0.6 },
            distance: 1,
          },
        ],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.URGENT_CARE,
          'UrgentCare',
          1,
          mockCenter,
          mockRadius,
          true,
        )
        .resolves(mockVaData)
        .withArgs(
          null,
          mockBounds,
          LocationType.URGENT_CARE,
          'NonVAUrgentCare',
          1,
          mockCenter,
          mockRadius,
          true,
        )
        .resolves(mockNonVaData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.URGENT_CARE,
        'AllUrgentCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );
      expect(
        dispatch.calledWith({
          type: FETCH_LOCATIONS,
          payload: {
            meta: {
              pagination: {
                currentPage: 1,
                nextPage: null,
                prevPage: null,
                totalPages: 1,
              },
            },
            links: {},
            data: [
              { attributes: { lat: 0.5, long: 0.5 }, distance: 0 },
              {
                attributes: { lat: 0.6, long: 0.6 },
                distance: 9.771648467983121, // 0.1 lat 0.1 long distance
              },
            ],
          },
        }),
      ).to.be.true;
    });

    it('should handle emergency care search with AllEmergencyCare service type', async () => {
      const mockVaData = {
        data: [
          {
            attributes: { lat: 0.5, long: 0.5 },
            distance: 0,
          },
        ],
      };
      const mockNonVaData = {
        data: [
          {
            attributes: { lat: 0.6, long: 0.6 },
            distance: 1,
          },
        ],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.EMERGENCY_CARE,
          'EmergencyCare',
          1,
          mockCenter,
          mockRadius,
          true,
        )
        .resolves(mockVaData)
        .withArgs(
          null,
          mockBounds,
          LocationType.EMERGENCY_CARE,
          'NonVAEmergencyCare',
          1,
          mockCenter,
          mockRadius,
          true,
        )
        .resolves(mockNonVaData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.EMERGENCY_CARE,
        'AllEmergencyCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );
      expect(
        dispatch.getCall(0).calledWith({
          type: 'FETCH_LOCATIONS',
          payload: {
            meta: {
              pagination: {
                currentPage: 1,
                nextPage: null,
                prevPage: null,
                totalPages: 1,
              },
            },
            links: {},
            data: [
              {
                attributes: {
                  lat: 0.5,
                  long: 0.5,
                },
                distance: 0,
              },
              {
                attributes: {
                  lat: 0.6,
                  long: 0.6,
                },
                distance: 9.771648467983121,
              },
            ],
          },
        }),
      ).to.be.true;
    });

    it('should handle single service type search', async () => {
      const mockData = {
        data: [
          {
            attributes: { lat: 0.5, long: 0.5 },
            distance: 0,
          },
          {
            attributes: { lat: 0.6, long: 0.6 },
            distance: 1,
          },
        ],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.URGENT_CARE,
          'UrgentCare',
          1,
          mockCenter,
          mockRadius,
        )
        .resolves(mockData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.URGENT_CARE,
        'UrgentCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );

      expect(
        dispatch.getCall(0).calledWith({
          type: 'FETCH_LOCATIONS',
          payload: {
            data: [
              { attributes: { lat: 0.5, long: 0.5 }, distance: 0 },
              {
                attributes: { lat: 0.6, long: 0.6 },
                distance: 9.771648467983121,
              },
            ],
          },
        }),
      ).to.be.true;
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      LocatorApi.searchWithBounds.rejects(error);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.URGENT_CARE,
        'UrgentCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );

      expect(
        dispatch.calledWith({
          type: SEARCH_FAILED,
          error: 'API Error',
        }),
      ).to.be.true;
    });

    it('should handle API response with errors', async () => {
      const mockData = {
        data: [],
        errors: ['API Error'],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.URGENT_CARE,
          'UrgentCare',
          1,
          mockCenter,
          mockRadius,
        )
        .resolves(mockData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.URGENT_CARE,
        'UrgentCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );

      expect(
        dispatch.calledWith({
          type: SEARCH_FAILED,
          error: ['API Error'],
        }),
      ).to.be.true;
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

    it('should handle successful API response', async () => {
      const data = { data: ['Specialty1', 'Specialty2'] };

      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'getProviderSpecialties').resolves(data);

      await getProviderSpecialties()(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(FETCH_SPECIALTIES);

      expect(dispatch.getCall(1).args[0]).to.deep.equal({
        type: FETCH_SPECIALTIES_DONE,
        data,
      });
      LocatorApi.getProviderSpecialties.restore();
    });

    it('should handle API response with errors', async () => {
      const mockData = {
        errors: ['API Error'],
      };
      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'getProviderSpecialties').resolves(mockData);

      await getProviderSpecialties()(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(FETCH_SPECIALTIES);
      expect(dispatch.getCall(1).args[0]).to.deep.equal({
        type: FETCH_SPECIALTIES_FAILED,
        error: ['API Error'],
      });
      LocatorApi.getProviderSpecialties.restore();
    });

    it('should handle API call failure', async () => {
      const dispatch = sinon.spy();
      sinon.stub(LocatorApi, 'getProviderSpecialties').restore();
      sinon
        .stub(LocatorApi, 'getProviderSpecialties')
        .rejects(new Error('Network Error'));

      await getProviderSpecialties()(dispatch);

      expect(dispatch.getCall(0).args[0].type).to.equal(FETCH_SPECIALTIES);
      expect(dispatch.getCall(1).args[0].type).to.equal(
        FETCH_SPECIALTIES_FAILED,
      );
      expect(dispatch.getCall(1).args[0].error.message).to.equal(
        'Network Error',
      );
      LocatorApi.getProviderSpecialties.restore();
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
