import { expect } from 'chai';
import sinon from 'sinon';
import { getRemainingEntitlement } from '../../actions/post-911-gib-status';
import { GET_REMAINING_ENTITLEMENT_SUCCESS } from '../../utils/constants';

let oldFetch;
let oldWindow;
const setup = () => {
  oldFetch = global.fetch;
  oldWindow = global.window;
  global.fetch = sinon.stub();
  global.fetch.returns(
    Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve({}),
    }),
  );
  global.window.dataLayer = [];
  global.window.URL = {
    createObjectURL: () => {},
    revokeObjectURL: () => {},
  };
};

const teardown = () => {
  global.fetch = oldFetch;
  global.window = oldWindow;
};

describe('getRemainingEntitlement', () => {
  const successResponse = {
    data: {
      id: 'string',
      type: 'evss_gi_bill_status_gi_bill_status_responses',
      attributes: {
        remainingEntitlement: {
          days: 0,
          months: 0,
        },
      },
    },
  };

  beforeEach(setup);
  afterEach(teardown);

  it('dispatches GET_REMAINING_ENTITLEMENT_SUCCESS on successful fetch', done => {
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/json' },
        ok: true,
        json: () => Promise.resolve(successResponse),
      }),
    );
    const thunk = getRemainingEntitlement();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_REMAINING_ENTITLEMENT_SUCCESS);
        expect(action.data.remainingEntitlement).to.equal(
          successResponse.data.attributes.remainingEntitlement,
        );
      })
      .then(done, done);
  });
});
