import { mockApiRequest } from 'platform/testing/unit/helpers.js';
import { expect } from 'chai';
import sinon from 'sinon';
import mockData from '../tests/e2e/fixtures/mocks/debts.json';

import {
  fetchDebts,
  DEBTS_FETCH_INIT,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../actions';

describe('fetchDebts', () => {
  it('should dispatch a success action and render debts', () => {
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchDebts()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(DEBTS_FETCH_INIT);
      expect(dispatch.thirdCall.args[0]).to.eql({
        type: DEBTS_FETCH_SUCCESS,
        ...mockData,
      });
    });
  });

  it('should dispatch a failure action', () => {
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return fetchDebts()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(DEBTS_FETCH_INIT);
      expect(dispatch.secondCall.args[0].type).to.equal(DEBTS_FETCH_FAILURE);
    });
  });
});
