import { expect } from 'chai';
import sinon from 'sinon-v20';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  fetchLocations,
  fetchVAFacility,
  getProviderSpecialties,
} from '../../actions/locations';
import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_FAILED,
  FETCH_SPECIALTIES_DONE,
  SEARCH_FAILED,
  SEARCH_STARTED,
} from '../../actions/actionTypes';
import { LocationType } from '../../constants';
import LocatorApi from '../../api';

describe('actions: locations', () => {
  afterEach(() => {
    sinon.restore();
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
                totalEntries: 2,
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

      expect(dispatch.getCall(0).args[0]).to.deep.equal({
        type: 'FETCH_LOCATIONS',
        payload: {
          meta: {
            pagination: {
              currentPage: 1,
              nextPage: null,
              prevPage: null,
              totalPages: 1,
              totalEntries: 2,
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
      });
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

    it('should correct totalEntries when API returns inconsistent pagination for single page', async () => {
      const mockData = {
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 1, // Single page
            totalEntries: 10, // Claims 10 results
            nextPage: null,
            prevPage: null,
          },
        },
        data: [
          {
            attributes: { lat: 0.5, long: 0.5 },
            distance: 0,
          },
          {
            attributes: { lat: 0.6, long: 0.6 },
            distance: 1,
          },
          {
            attributes: { lat: 0.7, long: 0.7 },
            distance: 2,
          },
          // Only 3 actual results
        ],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.HEALTH,
          'PrimaryCare',
          1,
          mockCenter,
          mockRadius,
        )
        .resolves(mockData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.HEALTH,
        'PrimaryCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );

      const dispatchedPayload = dispatch.getCall(0).args[0].payload;

      // Should correct totalEntries from 10 to 3 to match actual data
      expect(dispatchedPayload.meta.pagination.totalEntries).to.equal(3);
      expect(dispatchedPayload.data.length).to.equal(3);
    });

    it('should NOT correct totalEntries for multi-page results', async () => {
      const mockData = {
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 5, // Multiple pages
            totalEntries: 50, // Claims 50 total results
            nextPage: 2,
            prevPage: null,
          },
        },
        data: [
          { attributes: { lat: 0.5, long: 0.5 }, distance: 0 },
          { attributes: { lat: 0.6, long: 0.6 }, distance: 1 },
          { attributes: { lat: 0.7, long: 0.7 }, distance: 2 },
          { attributes: { lat: 0.8, long: 0.8 }, distance: 3 },
          { attributes: { lat: 0.9, long: 0.9 }, distance: 4 },
          { attributes: { lat: 1.0, long: 1.0 }, distance: 5 },
          { attributes: { lat: 1.1, long: 1.1 }, distance: 6 },
          { attributes: { lat: 1.2, long: 1.2 }, distance: 7 },
          { attributes: { lat: 1.3, long: 1.3 }, distance: 8 },
          { attributes: { lat: 1.4, long: 1.4 }, distance: 9 },
          // 10 results on this page
        ],
      };

      LocatorApi.searchWithBounds
        .withArgs(
          null,
          mockBounds,
          LocationType.HEALTH,
          'PrimaryCare',
          1,
          mockCenter,
          mockRadius,
        )
        .resolves(mockData);

      await fetchLocations(
        null,
        mockBounds,
        LocationType.HEALTH,
        'PrimaryCare',
        1,
        dispatch,
        mockCenter,
        mockRadius,
      );

      const dispatchedPayload = dispatch.getCall(0).args[0].payload;

      // Should NOT modify totalEntries for multi-page results
      expect(dispatchedPayload.meta.pagination.totalEntries).to.equal(50);
      expect(dispatchedPayload.data.length).to.equal(10);
    });
  });

  describe('fetchVAFacility', () => {
    beforeEach(() => {
      mockFetch();
    });

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

  describe(' getProviderSpecialties', () => {
    beforeEach(() => {
      mockFetch();
    });

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
});
