import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';

import {
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
  getAllPayments,
} from '../../actions';
import { payments } from '../helpers';

describe('View Payments actions: getAllPayments', () => {
  beforeEach(() => mockFetch());

  it('should get all payments', () => {
    global.fetch.returns({
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
    global.fetch.returns({
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
});
