import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';
import { getGMT } from '../../../actions/geographicMeansThreshold'; // Adjust the import path as necessary
import {
  GMT_FETCH_INITIATED,
  GMT_FETCH_SUCCESS,
  GMT_FETCH_FAILURE,
} from '../../../constants/actionTypes';

const dependents = 0;
const year = 2022;
const zipCode = '94608';

const mockResponse = {
  data: {
    gmtThreshold: 76750,
    nationalThreshold: 36659,
    pensionThreshold: 14753,
  },
};

const gmtData = {
  pensionThreshold: 14753,
  nationalThreshold: 36659,
  gmtThreshold: 76750,
  incomeUpperThreshold: 115125,
  assetThreshold: 4988.75,
  discretionaryIncomeThreshold: 959.375,
  error: null,
};

describe('getGMT action creator', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  it('should return mock data when useMockData is true', () => {
    return getGMT(dependents, year, zipCode, { useMockData: true })(
      dispatch,
    ).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(GMT_FETCH_INITIATED);
      expect(dispatch.secondCall.args[0]).to.eql({
        type: GMT_FETCH_SUCCESS,
        payload: gmtData,
      });
    });
  });

  it('should make an API call to staging when useStagingData is true', () => {
    mockApiRequest(mockResponse); // Mock response for staging API
    return getGMT(dependents, year, zipCode, { useStagingData: true })(
      dispatch,
    ).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(GMT_FETCH_INITIATED);
      // Assertions for staging environment...
    });
  });

  it('should make a regular API call when both toggles are false', () => {
    mockApiRequest(mockResponse); // Mock response for production API
    return getGMT(dependents, year, zipCode)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(GMT_FETCH_INITIATED);
      // Assertions for production environment...
    });
  });

  it('should dispatch a failed action if the API request fails', () => {
    mockApiRequest({}, false);
    return getGMT(dependents, year, zipCode)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(GMT_FETCH_INITIATED);
      expect(dispatch.secondCall.args[0].type).to.equal(GMT_FETCH_FAILURE);
    });
  });
});
