import { expect } from 'chai';
import sinon from 'sinon';

import {
  beneficiaryZIPCodeChanged,
  FETCH_BAH_FAILED,
  FETCH_BAH_SUCCEEDED,
  FETCH_PROFILE_STARTED
} from '../../actions/index';

let fetchMock;
let oldFetch;

const mockFetch = () => {
  oldFetch = global.fetch;
  fetchMock = sinon.stub();
  global.fetch = fetchMock;
};

const unMockFetch = () => {
  global.fetch = oldFetch;
};

describe.only('beneficiaryZIPCodeChanged', () => {
  beforeEach(mockFetch);
  it('should return BENEFICIARY_ZIP_CODE_CHANGED when zip code is no valid for submission', () => {
    const actualAction = beneficiaryZIPCodeChanged('1111');

    const expectedAction = {
      type: 'BENEFICIARY_ZIP_CODE_CHANGED',
      beneficiaryZIP: '1111'
    };
    expect(expectedAction).to.eql(actualAction);
  });

  it('should dispatch a success action', (done) => {
    const payload = {
      data: {}
    };
    fetchMock.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: true,
          json: () => Promise.resolve(payload) }) }),
    });
    const thunk = beneficiaryZIPCodeChanged('11111');
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.firstCall.args[0].type).to.eql(FETCH_APPEALS);
        expect(dispatchSpy.secondCall.args[0].type).to.eql(SET_APPEALS);
        done();
      }
    };

    thunk(dispatch);
  });

  it('should dispatch a failure action', () => {
    expect(true);
  });
  afterEach(unMockFetch);
});
