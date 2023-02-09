import { expect } from 'chai';
import sinon from 'sinon';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
// import {
//   mockFetch,
//   setFetchJSONFailure,
//   setFetchJSONResponse,
// } from 'platform/testing/unit/helpers';

import {
  addFile,
  cancelUpload,
  clearAdditionalEvidenceNotification,
  clearNotification,
  getClaimDetail,
  getClaimsV2,
  getStemClaims,
  pollRequest,
  removeFile,
  resetUploads,
  setAdditionalEvidenceNotification,
  setFieldsDirty,
  setLastPage,
  setNotification,
  submitRequest,
  updateField,
} from '../actions';

import {
  ADD_FILE,
  CANCEL_UPLOAD,
  CLEAR_NOTIFICATION,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  GET_CLAIM_DETAIL,
  REMOVE_FILE,
  RESET_UPLOADS,
  SET_CLAIM_DETAIL,
  SET_DECISION_REQUEST_ERROR,
  SET_DECISION_REQUESTED,
  SET_FIELDS_DIRTY,
  SET_LAST_PAGE,
  SET_NOTIFICATION,
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
  SUBMIT_DECISION_REQUEST,
  UPDATE_FIELD,
  FETCH_STEM_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_SUCCESS,
  FETCH_STEM_CLAIMS_PENDING,
} from '../actions/types';

describe('Actions', () => {
  describe('setNotification', () => {
    it('should return the correct action object', () => {
      const action = setNotification('Testing');

      expect(action).to.eql({
        type: SET_NOTIFICATION,
        message: 'Testing',
      });
    });
  });
  describe('setAdditionalEvidenceNotification', () => {
    it('should return the correct action object', () => {
      const action = setAdditionalEvidenceNotification('Testing');

      expect(action).to.eql({
        type: SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
        message: 'Testing',
      });
    });
  });
  describe('resetUploads', () => {
    it('should return the correct action object', () => {
      const action = resetUploads();

      expect(action).to.eql({
        type: RESET_UPLOADS,
      });
    });
  });
  describe('addFile', () => {
    it('should return the correct action object', () => {
      const action = addFile('Testing');

      expect(action).to.eql({
        type: ADD_FILE,
        files: 'Testing',
        isEncrypted: false,
      });
    });
  });
  describe('addFile with encrypted flag', () => {
    it('should return the correct action object', () => {
      const action = addFile('Testing', { isEncrypted: true });

      expect(action).to.eql({
        type: ADD_FILE,
        files: 'Testing',
        isEncrypted: true,
      });
    });
  });
  describe('removeFile', () => {
    it('should return the correct action object', () => {
      const action = removeFile(1);

      expect(action).to.eql({
        type: REMOVE_FILE,
        index: 1,
      });
    });
  });
  describe('clearNotification', () => {
    it('should return the correct action object', () => {
      const action = clearNotification();

      expect(action).to.eql({
        type: CLEAR_NOTIFICATION,
      });
    });
  });
  describe('clearAdditionalEvidenceNotification', () => {
    it('should return the correct action object', () => {
      const action = clearAdditionalEvidenceNotification();

      expect(action).to.eql({
        type: CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
      });
    });
  });
  describe('updateField', () => {
    it('should return the correct action object', () => {
      const action = updateField('path', 'field');

      expect(action).to.eql({
        type: UPDATE_FIELD,
        path: 'path',
        field: 'field',
      });
    });
  });
  describe('setFieldsDirty', () => {
    it('should return the correct action object', () => {
      const action = setFieldsDirty();

      expect(action).to.eql({
        type: SET_FIELDS_DIRTY,
      });
    });
  });

  describe('setLastPage', () => {
    it('should return the correct action object', () => {
      const action = setLastPage(2);

      expect(action).to.eql({
        type: SET_LAST_PAGE,
        page: 2,
      });
    });
  });
  describe('cancelUpload', () => {
    it('should call cancel on uploader', () => {
      const oldDataLayer = global.window.dataLayer;
      global.window.dataLayer = [];
      const thunk = cancelUpload();
      const uploaderSpy = sinon.spy();
      const dispatchSpy = sinon.spy();
      const getState = () => ({
        disability: {
          status: {
            uploads: {
              uploader: {
                cancelAll: uploaderSpy,
              },
            },
          },
        },
      });

      thunk(dispatchSpy, getState);

      expect(uploaderSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0].type).to.equal(CANCEL_UPLOAD);
      global.window.dataLayer = oldDataLayer;
    });
  });

  describe('getClaimsV2', () => {
    let dispatchSpy;
    let pollStatusSpy;
    let oldDataLayer;
    beforeEach(() => {
      oldDataLayer = global.window.dataLayer;
      global.window.dataLayer = [];
      dispatchSpy = sinon.spy();
      pollStatusSpy = sinon.spy();
    });
    afterEach(() => {
      global.window.dataLayer = oldDataLayer;
    });

    it('should call dispatch and pollStatus', () => {
      getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({
        type: 'FETCH_CLAIMS_PENDING',
      });
      expect(pollStatusSpy.calledOnce).to.be.true;
    });

    describe('onError callback', () => {
      it('should dispatch a FETCH_CLAIMS_ERROR action', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ errors: [] });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: 'FETCH_CLAIMS_ERROR',
        });
      });
      it('should record the correct event to the data layer', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ errors: [] });

        expect(global.window.dataLayer[0]).to.eql({
          event: 'api_call',
          'api-name': 'GET claims',
          /* eslint-disable camelcase */
          api_name: 'GET claims',
          'api-status': 'failed',
          api_status: 'failed',
          'error-key': 'unknown',
          error_key: 'unknown',
          'api-latency-ms': 0,
          api_latency_ms: 0,
          /* eslint-enable camelcase */
        });
        expect(global.window.dataLayer[1]).to.eql({
          'error-key': undefined,
        });
      });
    });
    describe('onSuccess callback', () => {
      it('should dispatch a FETCH_CLAIMS_SUCCESS action', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [] });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: 'FETCH_CLAIMS_SUCCESS',
          claims: [],
        });
      });
      it('should record the correct event to the data layer', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [] });

        expect(global.window.dataLayer[0]).to.eql({
          event: 'api_call',
          'api-name': 'GET claims',
          /* eslint-disable camelcase */
          api_name: 'GET claims',
          'api-status': 'successful',
          api_status: 'successful',
          'api-latency-ms': 0,
          api_latency_ms: 0,
          /* eslint-enable camelcase */
        });
      });
    });
    describe('shouldFail predicate', () => {
      it('should return true when response.meta.syncStatus is FAILED', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({
          meta: { syncStatus: 'FAILED' },
        });

        expect(shouldFail).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not FAILED', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({});

        expect(shouldFail).to.be.false;
      });
    });
    describe('shouldSucceed predicate', () => {
      it('should return true when response.meta.syncStatus is SUCCESS', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({
          meta: { syncStatus: 'SUCCESS' },
        });

        expect(shouldSucceed).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not SUCCESS', () => {
        getClaimsV2({ poll: pollStatusSpy })(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({});

        expect(shouldSucceed).to.be.false;
      });
    });
  });

  describe('getClaimDetail', () => {
    it('should call dispatch and pollStatus', () => {
      const dispatchSpy = sinon.spy();
      const pollStatusSpy = sinon.spy();
      getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({ type: GET_CLAIM_DETAIL });
      expect(pollStatusSpy.calledOnce).to.be.true;
    });

    describe('onError callback', () => {
      it('should dispatch a SET_CLAIMS_UNAVAILABLE action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ response: {} });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: 'SET_CLAIMS_UNAVAILABLE',
        });
      });
    });
    describe('onSuccess callback', () => {
      it('should dispatch a SET_CLAIM_DETAIL action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [], meta: 'test' });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: SET_CLAIM_DETAIL,
          claim: [],
          meta: 'test',
        });
      });
    });
    describe('shouldFail predicate', () => {
      it('should return true when response.meta.syncStatus is FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({
          meta: { syncStatus: 'FAILED' },
        });

        expect(shouldFail).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({});

        expect(shouldFail).to.be.false;
      });
    });
    describe('shouldSucceed predicate', () => {
      it('should return true when response.meta.syncStatus is SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({
          meta: { syncStatus: 'SUCCESS' },
        });

        expect(shouldSucceed).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({});

        expect(shouldSucceed).to.be.false;
      });
    });
  });

  describe('pollClaimStatus', () => {
    it('should call apiRequest', () => {
      const apiRequestSpy = sinon.spy();

      pollRequest({ request: apiRequestSpy });
      expect(apiRequestSpy.calledOnce).to.be.true;
    });
    describe('apiRequest response handler', () => {
      it('should call onSuccess when shouldSucceed returns true', () => {
        const apiRequestSpy = sinon.spy();
        const mockResponse = {};
        const onSuccessSpy = sinon.spy();
        const onErrorSpy = sinon.spy();
        const shouldSucceedStub = sinon.stub();
        shouldSucceedStub.returns(true);

        pollRequest({
          onError: onErrorSpy,
          onSuccess: onSuccessSpy,
          request: apiRequestSpy,
          shouldSucceed: shouldSucceedStub,
        });
        apiRequestSpy.firstCall.args[2](mockResponse);

        expect(onSuccessSpy.calledOnce).to.be.true;
        expect(onErrorSpy.called).to.be.false;
        expect(shouldSucceedStub.firstCall.args[0]).to.eql(mockResponse);
      });
      it('should call onError when shouldSuccess return false shouldFail returns true', () => {
        const apiRequestSpy = sinon.spy();
        const mockResponse = {};
        const onErrorSpy = sinon.spy();
        const onSuccessSpy = sinon.spy();
        const shouldFailStub = sinon.stub();
        const shouldSucceedStub = sinon.stub();
        shouldSucceedStub.returns(false);
        shouldFailStub.returns(true);

        pollRequest({
          onError: onErrorSpy,
          onSuccess: onSuccessSpy,
          request: apiRequestSpy,
          shouldFail: shouldFailStub,
          shouldSucceed: shouldSucceedStub,
        });
        apiRequestSpy.firstCall.args[2](mockResponse);

        expect(onSuccessSpy.calledOnce).to.be.false;
        expect(onErrorSpy.calledOnce).to.be.true;
        expect(shouldFailStub.firstCall.args[0]).to.eql(mockResponse);
      });
    });
  });
  describe('submitRequest', () => {
    let expectedUrl;
    const server = setupServer();

    before(() => {
      server.listen();
      server.events.on('request:start', req => {
        expectedUrl = req.url.href;
      });
    });

    afterEach(() => {
      server.resetHandlers();
      expectedUrl = undefined;
    });

    after(() => server.close());

    it('should submit request', done => {
      const ID = 5;
      server.use(
        rest.post(
          `https://dev-api.va.gov/v0/evss_claims/${ID}/request_decision`,
          (req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                // eslint-disable-next-line camelcase
                job_id: ID,
              }),
            ),
        ),
      );

      const thunk = submitRequest(ID);
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 3) {
          expect(expectedUrl).to.contain('5/request_decision');
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: SUBMIT_DECISION_REQUEST,
          });
          expect(dispatchSpy.secondCall.args[0]).to.eql({
            type: SET_DECISION_REQUESTED,
          });
          expect(dispatchSpy.thirdCall.args[0].type).to.eql(SET_NOTIFICATION);
          done();
        }
      };

      thunk(dispatch);
    });
    it('should fail on error', done => {
      const ID = 5;
      server.use(
        rest.post(
          `https://dev-api.va.gov/v0/evss_claims/${ID}/request_decision`,
          (req, res, ctx) => res(ctx.status(400), ctx.json({ status: 400 })),
        ),
      );
      const thunk = submitRequest(ID);
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: SUBMIT_DECISION_REQUEST,
          });
          expect(dispatchSpy.secondCall.args[0].type).to.eql(
            SET_DECISION_REQUEST_ERROR,
          );
          done();
        }
      };

      thunk(dispatch);
    });
  });

  describe('getStemClaims', () => {
    const server = setupServer();

    before(() => {
      server.listen();
    });

    afterEach(() => {
      server.resetHandlers();
    });

    after(() => server.close());

    it('should fetch stem claims', done => {
      server.use(
        rest.get(
          `https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status`,
          (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [] })),
        ),
      );

      const thunk = getStemClaims();
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.eql(
            FETCH_STEM_CLAIMS_PENDING,
          );
          expect(dispatchSpy.secondCall.args[0].type).to.eql(
            FETCH_STEM_CLAIMS_SUCCESS,
          );
          done();
        }
      };

      thunk(dispatch);
    });
    it('should fail on error', done => {
      server.use(
        rest.get(
          `https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status`,
          (req, res, ctx) => res(ctx.status(400)),
        ),
      );
      const thunk = getStemClaims();
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.eql(
            FETCH_STEM_CLAIMS_PENDING,
          );
          expect(dispatchSpy.secondCall.args[0].type).to.eql(
            FETCH_STEM_CLAIMS_ERROR,
          );
          done();
        }
      };

      thunk(dispatch);
    });
  });
});
