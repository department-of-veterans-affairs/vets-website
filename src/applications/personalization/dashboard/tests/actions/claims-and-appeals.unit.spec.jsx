import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import { createClaimsSuccess } from '../../mocks/claims';
import { createAppealsSuccess } from '../../mocks/appeals';
import {
  getAppeals,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
} from '../../actions/appeals';
import {
  getClaims,
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_ERROR,
  FETCH_CLAIMS_SUCCESS,
} from '../../actions/claims';

describe('/actions/claims-and-appeals', () => {
  describe('getAppeals', () => {
    let dispatchSpy;
    beforeEach(() => {
      mockFetch();
      dispatchSpy = sinon.spy();
    });
    it('should dispatch FETCH_APPEALS_PENDING action', () => {
      getAppeals()(dispatchSpy);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        FETCH_APPEALS_PENDING,
      );
    });

    it('should dispatch a FETCH_APPEALS_SUCCESS action', () => {
      setFetchJSONResponse(global.fetch.onCall(0), createAppealsSuccess());
      const thunk = getAppeals();

      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_APPEALS_SUCCESS,
          );
        }
      };
      thunk(dispatch);
    });

    const appealsErrors = {
      403: USER_FORBIDDEN_ERROR,
      404: RECORD_NOT_FOUND_ERROR,
      422: VALIDATION_ERROR,
      502: BACKEND_SERVICE_ERROR,
      504: FETCH_APPEALS_ERROR, // works for any unspecified error code
    };

    Object.keys(appealsErrors).forEach(code => {
      it(`Dispatches ${
        appealsErrors[code]
      } when GET fails with ${code}`, done => {
        setFetchJSONFailure(global.fetch.onCall(0), {
          errors: [{ status: `${code}` }],
        });
        const thunk = getAppeals();
        const dispatch = sinon.spy();
        thunk(dispatch)
          .then(() => {
            const action = dispatch.secondCall.args[0];
            expect(action.type).to.equal(appealsErrors[code]);
          })
          .then(done, done);
      });
    });

    describe('default case in switch statement (error codes other than 403, 404, 422, 502)', () => {
      // Test error status codes that should dispatch FETCH_APPEALS_ERROR
      // These codes are not handled by specific switch cases (403, 404, 422, 502)
      const defaultCaseErrorCodes = ['400', '401', '500', '503', '504', '505'];

      defaultCaseErrorCodes.forEach(code => {
        it(`should dispatch FETCH_APPEALS_ERROR when GET fails with status ${code}`, done => {
          // Test with error codes that are not in the switch cases
          // This explicitly tests the default branch
          setFetchJSONFailure(global.fetch.onCall(0), {
            errors: [{ status: code }],
          });
          const thunk = getAppeals();
          const dispatch = sinon.spy();
          thunk(dispatch)
            .then(() => {
              const action = dispatch.secondCall.args[0];
              expect(action.type).to.equal(FETCH_APPEALS_ERROR);
            })
            .then(done, done);
        });
      });
    });
  });

  describe('getClaims', () => {
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

    it('should dispatch FETCH_CLAIMS_PENDING action', () => {
      getClaims()(dispatchSpy);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(FETCH_CLAIMS_PENDING);
    });

    describe('onSuccess callback', () => {
      it('should dispatch a FETCH_CLAIMS_SUCCESS action and record the correct event to the data layer', () => {
        setFetchJSONResponse(global.fetch.onCall(0), createClaimsSuccess());
        const thunk = getClaims();

        const dispatch = action => {
          dispatchSpy(action);
          if (dispatchSpy.callCount === 2) {
            expect(dispatchSpy.secondCall.args[0].type).to.equal(
              FETCH_CLAIMS_SUCCESS,
            );
            expect(global.window.dataLayer[0]).to.eql({
              event: 'api_call',
              'api-name': 'GET Lighthouse claims /v0/benefits_claims',
              'api-status': 'successful',
              'api-latency-ms': 0,
            });
          }
        };
        thunk(dispatch);
      });
    });

    describe('onError callback', () => {
      it('should dispatch a FETCH_CLAIMS_ERROR action and record the correct event to the data layer', () => {
        const response = {
          errors: [
            {
              code: '500',
              status: 'some status',
            },
          ],
        };
        setFetchJSONFailure(global.fetch.onCall(0), response);
        const thunk = getClaims();

        const dispatch = action => {
          dispatchSpy(action);
          if (dispatchSpy.callCount === 2) {
            expect(dispatchSpy.secondCall.args[0].type).to.equal(
              FETCH_CLAIMS_ERROR,
            );
            expect(global.window.dataLayer[1]).to.eql({
              'error-key': undefined,
            });
          }
        };
        thunk(dispatch);
      });
    });
  });
});
