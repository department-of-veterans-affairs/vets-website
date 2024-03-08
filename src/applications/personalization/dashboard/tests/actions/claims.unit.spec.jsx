import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import { createClaimsSuccess } from '../../mocks/claims';
import { createAppealsSuccess } from '../../mocks/appeals-success';
import { getAppealsV2, getClaims } from '../../actions/claims';

import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_ERROR,
  FETCH_CLAIMS_SUCCESS,
} from '../../utils/claims-helpers';
import {
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
} from '../../utils/appeals-helpers';

describe('/actions/claims', () => {
  describe('getAppealsV2', () => {
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

    it('should dispatch FETCH_APPEALS_PENDING action', () => {
      getAppealsV2()(dispatchSpy);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        FETCH_APPEALS_PENDING,
      );
    });

    it('should dispatch a FETCH_APPEALS_SUCCESS action', () => {
      setFetchJSONResponse(global.fetch.onCall(0), createAppealsSuccess());
      const thunk = getAppealsV2();

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
        setFetchJSONResponse(
          global.fetch.onCall(0),
          Promise.reject({
            errors: [{ status: `${code}` }],
          }),
        );
        const thunk = getAppealsV2();
        const dispatch = sinon.spy();
        thunk(dispatch)
          .then(() => {
            const action = dispatch.secondCall.args[0];
            expect(action.type).to.equal(appealsErrors[code]);
          })
          .then(done, done);
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
