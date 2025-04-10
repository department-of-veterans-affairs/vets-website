import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import {
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
  FETCH_FACILITY_FAILED,
  fetchFacilitySuccess,
  fetchFacilityStarted,
  fetchFacilityFailed,
  fetchFacility,
} from '../actions';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';

const getState = () => ({
  facility: {
    loading: false,
    data: {},
    error: false,
  },
});

describe('Facilities actions', () => {
  describe('fetchFacilityStarted', () => {
    it('should return action', () => {
      const action = fetchFacilityStarted();

      expect(action.type).to.equal(FETCH_FACILITY_STARTED);
    });
  });
  describe('fetchFacilitySuccess', () => {
    it('should return action', () => {
      const action = fetchFacilitySuccess(
        mockFacilityLocatorApiResponse.data[0],
      );

      expect(action.type).to.equal(FETCH_FACILITY_SUCCESS);
      expect(action.facility.id).to.equal(
        mockFacilityLocatorApiResponse.data[0].id,
      );
    });
  });
  describe('fetchFacilityFailed', () => {
    it('should return action', () => {
      const action = fetchFacilityFailed();

      expect(action.type).to.equal(FETCH_FACILITY_FAILED);
    });
  });
  describe('fetchFacility', () => {
    it('dispatches a pending', done => {
      const thunk = fetchFacility('vha_646');
      const dispatch = sinon.spy();
      mockApiRequest({ data: mockFacilityLocatorApiResponse.data[0] });

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.calledWith(fetchFacilityStarted())).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('calls the api to get the facility', done => {
      const thunk = fetchFacility('vha_646');
      const dispatch = sinon.spy();
      mockApiRequest({ data: mockFacilityLocatorApiResponse.data[0] });
      thunk(dispatch, getState)
        .then(() => {
          expect(global.fetch.args[0][0]).to.contain('/facilities_api/v2/va');
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a success if there are no errors', done => {
      const thunk = fetchFacility('vha_646');
      const dispatch = sinon.spy();
      mockApiRequest({ data: mockFacilityLocatorApiResponse.data[0] });

      thunk(dispatch, getState)
        .then(() => {
          expect(
            dispatch.calledWith(
              fetchFacilitySuccess(mockFacilityLocatorApiResponse.data[0]),
            ),
          ).to.be.true;

          expect(dispatch.secondCall.args[0].type).to.equal(
            FETCH_FACILITY_SUCCESS,
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a failure on any failure', done => {
      const thunk = fetchFacility('vha_646');
      const dispatch = sinon.spy();
      mockApiRequest({}, false);

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.calledWith(fetchFacilityFailed())).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
