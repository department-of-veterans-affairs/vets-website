import { expect } from 'chai';
import sinon from 'sinon';

import {
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
  getAllPayments,
} from '../../actions';

import { payments } from '../helpers';

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

describe('View Payments actions: getAllPayments', () => {
  beforeEach(mockFetch);

  it('should get all payments', () => {
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(payments) }),
      }),
    });
    const thunk = getAllPayments();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          PAYMENTS_RECEIVED_SUCCEEDED,
        );
      }
    };
    thunk(dispatch);
  });

  it('should handle an error', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'Some status',
        },
      ],
    };
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(response) }),
      }),
    });
    const thunk = getAllPayments();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          PAYMENTS_RECEIVED_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
  afterEach(unMockFetch);
});
