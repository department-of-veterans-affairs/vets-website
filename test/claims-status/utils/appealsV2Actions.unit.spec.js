import { expect } from 'chai';
import sinon from 'sinon';
import {
  getAppealsV2,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  SET_APPEALS_UNAVAILABLE
} from '../../../src/js/claims-status/actions';

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

describe.only('getAppealsV2', () => {
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

  it('dispatches FETCH_APPEALS_UNAVAILABLE', (done) => {
    global.fetch.returns(Promise.reject());
    const thunk = getAppealsV2();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(SET_APPEALS_UNAVAILABLE);
      }).then(done, done);
  });

});
