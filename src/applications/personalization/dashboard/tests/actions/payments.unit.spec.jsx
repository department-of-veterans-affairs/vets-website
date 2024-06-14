import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
  getAllPayments,
} from '../../actions/payments';
import {
  paymentsSuccess,
  paymentsClientError,
  paymentsServerError,
} from '../fixtures/test-payments-response';

describe('getAllPayments action', () => {
  let dispatchSpy;
  let oldDataLayer;
  beforeEach(() => {
    mockFetch();
    oldDataLayer = global.window.dataLayer;
    global.window.dataLayer = [];
    dispatchSpy = sinon.spy();
  });
  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
  });

  it('should get all payments and dispatches success', () => {
    const response = paymentsSuccess();
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const thunk = getAllPayments();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          PAYMENTS_RECEIVED_SUCCEEDED,
        );
        expect(global.window.dataLayer[0]).to.eql({
          event: 'api_call',
          'api-name': 'GET payment history',
          'api-status': 'successful',
        });
      }
    };
    thunk(dispatch);
  });

  describe('onError callback', () => {
    it('catch error and should dispatch a PAYMENTS_RECEIVED_FAILED action', () => {
      const response = paymentsServerError();
      setFetchJSONFailure(global.fetch.onCall(0), response);
      const thunk = getAllPayments();
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

    it('should dispatch a PAYMENTS_RECEIVED_FAILED action and record event as server error', () => {
      const response = paymentsServerError();
      setFetchJSONResponse(global.fetch.onCall(0), response);
      const thunk = getAllPayments();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            PAYMENTS_RECEIVED_FAILED,
          );
          expect(global.window.dataLayer[0]).to.eql({
            event: 'api_call',
            'error-key': '500 server error',
            'api-name': 'GET payment history',
            'api-status': 'failed',
          });
        }
      };

      thunk(dispatch);
    });

    it('should dispatch a PAYMENTS_RECEIVED_FAILED action and record event as client error', () => {
      const response = paymentsClientError();
      setFetchJSONResponse(global.fetch.onCall(0), response);
      const thunk = getAllPayments();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            PAYMENTS_RECEIVED_FAILED,
          );
          expect(global.window.dataLayer[0]).to.eql({
            event: 'api_call',
            'error-key': '404 client error',
            'api-name': 'GET payment history',
            'api-status': 'failed',
          });
        }
      };

      thunk(dispatch);
    });
  });
});
