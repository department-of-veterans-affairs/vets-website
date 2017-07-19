import { expect } from 'chai';
import sinon from 'sinon';

import {
  // BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  // GET_ENROLLMENT_DATA_FAILURE,
  // GET_ENROLLMENT_DATA_SUCCESS,
  // NO_CHAPTER33_RECORD_AVAILABLE
} from '../../../src/js/post-911-gib-status/utils/constants';

import {
  getEnrollmentData
} from '../../../src/js/post-911-gib-status/actions/post-911-gib-status';

let oldFetch;
let oldSessionStorage;

const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({ ok: true }));
};

const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
};

describe('get enrollment data', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('should dispatch success action type when service is available', () => {
  });

  it('should dispatch service error action type for 503/504 response', (done) => {
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    global.fetch.reset();
    global.fetch.returns({
      then: (fn) => fn({ ok: false,
                         status: 503,
                         json: () => Promise.resolve({}),
                         headers: { get: () => 'application/json' } })
    });

    thunk(dispatch).then(() => {
      expect(dispatch.calledWith({ type: BACKEND_SERVICE_ERROR })).to.be.true;
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should dispatch authentication error action type for 403 response', () => {
  });

  it('should dispatch no chapter 33 records action type for 404 response', () => {
  });

  it('should dispatch failure action type when response status code is not recognized', () => {
  });
});
