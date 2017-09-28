import { expect } from 'chai';
import sinon from 'sinon';

import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_ENROLLMENT_DATA_FAILURE,
  GET_ENROLLMENT_DATA_SUCCESS,
  NO_CHAPTER33_RECORD_AVAILABLE
} from '../../../src/js/post-911-gib-status/utils/constants';

import {
  getEnrollmentData
} from '../../../src/js/post-911-gib-status/actions/post-911-gib-status';

let oldFetch;
let oldSessionStorage;
let oldWindow;

const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  oldWindow = global.window;

  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({ ok: true }));
  global.window = { dataLayer: [] };
};

const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
  global.window = oldWindow;
};

describe('get enrollment data', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('should dispatch success action type when service is available', (done) => {
    global.fetch.reset();
    global.fetch.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
          headers: { get: () => 'application/json' }
        })
      })
    });
    const thunk = getEnrollmentData();
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.eql(GET_ENROLLMENT_DATA_SUCCESS);
      done();
    };

    thunk(dispatch);
  });

  it('should dispatch service error action type for 503/504 response', (done) => {
    global.fetch.reset();
    global.fetch.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: false,
          status: 504,
          json: () => Promise.resolve({
            errors: [
              {
                title: 'Gateway timeout',
                detail: 'Did not receive a timely response from an upstream server',
                code: '504',
                status: '504'
              }
            ]
          }),
          headers: { get: () => 'application/json' }
        })
      })
    });
    const thunk = getEnrollmentData();
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.eql(BACKEND_SERVICE_ERROR);
      done();
    };

    thunk(dispatch);
  });

  it('should dispatch authentication error action type for 403 response', (done) => {
    global.fetch.reset();
    global.fetch.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: false,
          status: 403,
          json: () => Promise.resolve({
            errors: [
              {
                title: 'Forbidden',
                detail: '',
                code: '403',
                status: '403'
              }
            ]
          }),
          headers: { get: () => 'application/json' }
        })
      })
    });
    const thunk = getEnrollmentData();
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.eql(BACKEND_AUTHENTICATION_ERROR);
      done();
    };

    thunk(dispatch);
  });

  it('should dispatch no chapter 33 records action type for 404 response', (done) => {
    global.fetch.reset();
    global.fetch.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: false,
          status: 404,
          json: () => Promise.resolve({
            errors: [
              {
                title: 'Record not found',
                detail: 'The record identified by joe.vet@aol.com could not be found',
                code: '404',
                status: '404'
              }
            ]
          }),
          headers: { get: () => 'application/json' }
        })
      })
    });
    const thunk = getEnrollmentData();
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.eql(NO_CHAPTER33_RECORD_AVAILABLE);
      done();
    };

    thunk(dispatch);
  });

  it('should dispatch failure action type when response status code is not recognized', (done) => {
    global.fetch.reset();
    global.fetch.returns({
      'catch': () => ({
        then: (fn) => fn({
          ok: false,
          status: 777,
          json: () => Promise.resolve({}),
          headers: { get: () => 'application/json' }
        })
      })
    });
    const thunk = getEnrollmentData();
    const dispatchSpy = sinon.spy();
    const dispatch = (action) => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.eql(GET_ENROLLMENT_DATA_FAILURE);
      done();
    };

    thunk(dispatch);
  });
});
