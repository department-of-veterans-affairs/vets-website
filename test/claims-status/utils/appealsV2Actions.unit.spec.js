import { expect } from 'chai';
import sinon from 'sinon';
import {
  getAppealsV2,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
} from '../../../src/js/claims-status/actions';
import {
  USER_FORBIDDEN,
  RECORD_NOT_FOUND,
  VALIDATION_ERROR,
  APPEALS_FETCH_ERROR,
  BACKEND_SERVICE_ERROR,
} from '../../../src/js/claims-status/utils/appeals-v2-helpers';

let oldFetch;
let oldSessionStorage;

const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = { userToken: '123' };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({
    headers: { get: () => 'application/json' },
    ok: true,
    json: () => Promise.resolve({})
  }));
};

const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
};

describe('getAppealsV2', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('dispatches FETCH_APPEALS_PENDING', (done) => {
    const thunk = getAppealsV2();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(FETCH_APPEALS_PENDING);
      }).then(done, done);
  });

  it('dispatches FETCH_APPEALS_SUCCESS', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve({})
    }));

    const thunk = getAppealsV2();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(FETCH_APPEALS_SUCCESS);
      }).then(done, done);
  });

  const appealsErrors = {
    403: USER_FORBIDDEN,
    404: RECORD_NOT_FOUND,
    422: VALIDATION_ERROR,
    502: BACKEND_SERVICE_ERROR,
    504: APPEALS_FETCH_ERROR // works for any unspecified error code
  };

  Object.keys(appealsErrors).forEach((code) => {
    it(`Dispatches ${appealsErrors[code]} when GET fails with ${code}`, (done) => {
      global.fetch.returns(Promise.reject({
        errors: [{ status: `${code}` }],
      }));
      const thunk = getAppealsV2();
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.secondCall.args[0];
          expect(action.type).to.equal(appealsErrors[code]);
        }).then(done, done);
    });
  });
});
