import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { getRemainingEntitlement } from '../../actions/post-911-gib-status';

const GET_REMAINING_ENTITLEMENT_SUCCESS = 'GET_REMAINING_ENTITLEMENT_SUCCESS';

let oldWindow;
const setup = () => {
  mockFetch();
  oldWindow = global.window;
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    dataLayer: [],
    URL: {
      createObjectURL: () => {},
      revokeObjectURL: () => {},
    },
  });
};

const teardown = () => {
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
    setFetchJSONResponse(global.fetch.onCall(0), successResponse);
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
