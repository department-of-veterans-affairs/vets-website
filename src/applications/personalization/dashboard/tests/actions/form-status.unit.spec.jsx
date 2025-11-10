import { expect } from 'chai';
import sinon, { stub } from 'sinon';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import * as recordEventModule from 'platform/monitoring/record-event';

import {
  fetchFormStatuses,
  FETCH_FORM_STATUS_STARTED,
  FETCH_FORM_STATUS_SUCCEEDED,
  FETCH_FORM_STATUS_FAILED,
} from '../../actions/form-status';

describe('form-status actions', () => {
  let dispatchSpy;
  let recordEventStub;
  let oldWindowAppName;

  beforeEach(() => {
    mockFetch();
    dispatchSpy = sinon.spy();
    recordEventStub = stub(recordEventModule, 'default');
    oldWindowAppName = global.window.appName;
    global.window.appName = 'test-app';
  });

  afterEach(() => {
    resetFetch();
    recordEventStub.restore();
    global.window.appName = oldWindowAppName;
  });

  describe('fetchFormStatuses', () => {
    describe('success path', () => {
      it('should dispatch FETCH_FORM_STATUS_STARTED first', async () => {
        const response = {
          data: [{ id: 1, form: '21-526EZ' }],
          errors: [],
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0].type).to.equal(
          FETCH_FORM_STATUS_STARTED,
        );
      });

      it('should dispatch FETCH_FORM_STATUS_SUCCEEDED with response.data and response.errors', async () => {
        const responseData = [
          { id: 1, form: '21-526EZ', status: 'submitted' },
          { id: 2, form: '10-10EZ', status: 'in_progress' },
        ];
        const responseErrors = [{ code: '422', status: 'Validation Error' }];
        const response = {
          data: responseData,
          errors: responseErrors,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const actions = dispatchSpy.getCalls().map(c => c.args[0]);
        expect(actions[1].type).to.equal(FETCH_FORM_STATUS_SUCCEEDED);
        expect(actions[1].forms).to.eql(responseData);
        expect(actions[1].errors).to.eql(responseErrors);
      });

      it('should dispatch FETCH_FORM_STATUS_SUCCEEDED with actionSuccess using response.data', async () => {
        const responseData = [{ id: 1, form: '21-526EZ' }];
        const response = {
          data: responseData,
          errors: null,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.type).to.equal(FETCH_FORM_STATUS_SUCCEEDED);
        expect(successAction.forms).to.eql(responseData);
      });

      it('should dispatch FETCH_FORM_STATUS_SUCCEEDED with actionSuccess using response.errors', async () => {
        const responseErrors = [
          { code: '500', status: 'Internal Server Error' },
        ];
        const response = {
          data: [],
          errors: responseErrors,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.type).to.equal(FETCH_FORM_STATUS_SUCCEEDED);
        expect(successAction.errors).to.eql(responseErrors);
      });

      it('should call recordSuccess when fetch succeeds', async () => {
        const response = {
          data: [{ id: 1 }],
          errors: [],
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        expect(recordEventStub.called).to.be.true;
        const successCall = recordEventStub
          .getCalls()
          .find(
            call =>
              call.args[0]['api-status'] === 'successful' &&
              call.args[0]['api-name'] === 'GET form submission status',
          );
        expect(successCall).to.exist;
        expect(successCall.args[0]).to.deep.include({
          event: 'api_call',
          'api-name': 'GET form submission status',
          'api-status': 'successful',
        });
      });

      it('should return the dispatched success action', async () => {
        const response = {
          data: [{ id: 1 }],
          errors: [],
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        // Create a dispatch function that returns the action (like Redux dispatch does)
        const dispatch = action => {
          dispatchSpy(action);
          return action;
        };

        const thunk = fetchFormStatuses();
        const result = await thunk(dispatch);

        expect(result.type).to.equal(FETCH_FORM_STATUS_SUCCEEDED);
        expect(result.forms).to.eql(response.data);
        expect(result.errors).to.eql(response.errors);
      });
    });

    describe('error path (catch block)', () => {
      it('should dispatch FETCH_FORM_STATUS_STARTED first even on error', async () => {
        const errorResponse = { error: 'Network error' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        expect(dispatchSpy.firstCall.args[0].type).to.equal(
          FETCH_FORM_STATUS_STARTED,
        );
      });

      it('should dispatch FETCH_FORM_STATUS_FAILED with error when fetch fails', async () => {
        const errorResponse = { error: 'Network error', code: '500' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        const actions = dispatchSpy.getCalls().map(c => c.args[0]);
        const failAction = actions.find(
          a => a.type === FETCH_FORM_STATUS_FAILED,
        );
        expect(failAction).to.exist;
        expect(failAction.type).to.equal(FETCH_FORM_STATUS_FAILED);
        expect(failAction.error).to.exist;
      });

      it('should call recordFail with "internal error" parameter when fetch fails', async () => {
        const errorResponse = { error: 'Server error' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        expect(recordEventStub.called).to.be.true;
        const failCall = recordEventStub
          .getCalls()
          .find(
            call =>
              call.args[0]['api-status'] === 'failed' &&
              call.args[0]['error-key'] === 'internal error',
          );
        expect(failCall).to.exist;
        expect(failCall.args[0]).to.deep.include({
          event: 'api_call',
          'api-name': 'GET form submission status',
          'api-status': 'failed',
          'error-key': 'internal error',
        });
      });

      it('should throw error after dispatching failure action', async () => {
        const errorResponse = { error: 'Test error' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        let thrownError;
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          thrownError = e;
        }

        expect(thrownError).to.exist;
        expect(thrownError).to.be.instanceOf(Error);
      });

      it('should dispatch actionFail with the caught error', async () => {
        const errorResponse = { error: 'Custom error message', code: '404' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        const actions = dispatchSpy.getCalls().map(c => c.args[0]);
        const failAction = actions.find(
          a => a.type === FETCH_FORM_STATUS_FAILED,
        );
        expect(failAction.error).to.exist;
      });
    });

    describe('actionSuccess behavior with response.data and response.errors', () => {
      it('should set forms from response.data when present', async () => {
        const responseData = [
          { id: 1, form: '21-526EZ' },
          { id: 2, form: '10-10EZ' },
        ];
        const response = {
          data: responseData,
          errors: [],
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.forms).to.eql(responseData);
      });

      it('should set errors from response.errors when present', async () => {
        const responseErrors = [
          { code: '422', status: 'Validation Error' },
          { code: '500', status: 'Internal Server Error' },
        ];
        const response = {
          data: [],
          errors: responseErrors,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.errors).to.eql(responseErrors);
      });

      it('should handle both response.data and response.errors together', async () => {
        const responseData = [{ id: 1, form: '21-526EZ' }];
        const responseErrors = [{ code: '422', status: 'Validation Error' }];
        const response = {
          data: responseData,
          errors: responseErrors,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.forms).to.eql(responseData);
        expect(successAction.errors).to.eql(responseErrors);
      });

      it('should handle response.data as null', async () => {
        const response = {
          data: null,
          errors: [],
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.forms).to.be.null;
      });

      it('should handle response.errors as null', async () => {
        const response = {
          data: [],
          errors: null,
        };
        setFetchJSONResponse(global.fetch.onCall(0), response);

        const thunk = fetchFormStatuses();
        await thunk(dispatchSpy);

        const successAction = dispatchSpy.secondCall.args[0];
        expect(successAction.errors).to.be.null;
      });
    });

    describe('recordFail with default parameter vs provided parameter', () => {
      it('should call recordFail with "internal error" parameter in catch block', async () => {
        const errorResponse = { error: 'Test error' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        // Verify recordFail was called with 'internal error' (not default 'server error')
        const failCall = recordEventStub
          .getCalls()
          .find(
            call =>
              call.args[0]['api-status'] === 'failed' &&
              call.args[0]['error-key'] === 'internal error',
          );
        expect(failCall).to.exist;
        expect(failCall.args[0]['error-key']).to.equal('internal error');
        expect(failCall.args[0]['error-key']).to.not.equal('server error');
      });

      it('should include correct RECORD_PROPS in recordFail call', async () => {
        const errorResponse = { error: 'Test error' };
        setFetchJSONFailure(global.fetch.onCall(0), errorResponse);

        const thunk = fetchFormStatuses();
        try {
          await thunk(dispatchSpy);
        } catch (e) {
          // Expected to throw
        }

        const failCall = recordEventStub
          .getCalls()
          .find(call => call.args[0]['api-status'] === 'failed');
        expect(failCall.args[0]).to.deep.include({
          event: 'api_call',
          'api-name': 'GET form submission status',
          'api-status': 'failed',
          'error-key': 'internal error',
        });
      });
    });
  });
});
