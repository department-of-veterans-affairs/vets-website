import { expect } from 'chai';
import sinon from 'sinon';

import conditionalStorage from '../../../platform/utilities/storage/conditionalStorage';

import {
  ADD_FILE,
  addFile,
  CANCEL_UPLOAD,
  cancelUpload,
  CHANGE_CLAIMS_PAGE,
  changePage,
  CLEAR_NOTIFICATION,
  clearNotification,
  FETCH_APPEALS,
  GET_CLAIM_DETAIL,
  getAppeals,
  getClaimDetail,
  getClaimsV2,
  pollRequest,
  REMOVE_FILE,
  removeFile,
  RESET_UPLOADS,
  resetUploads,
  SET_APPEALS_UNAVAILABLE,
  SET_APPEALS,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
  SET_DECISION_REQUEST_ERROR,
  SET_DECISION_REQUESTED,
  SET_FIELDS_DIRTY,
  SET_LAST_PAGE,
  SET_NOTIFICATION,
  setFieldsDirty,
  setLastPage,
  setNotification,
  setUnavailable,
  SHOW_CONSOLIDATED_MODAL,
  SHOW_MAIL_OR_FAX,
  showConsolidatedMessage,
  showMailOrFaxModal,
  SUBMIT_DECISION_REQUEST,
  submitRequest,
  UPDATE_FIELD,
  updateField,
} from '../actions';

let fetchMock;
let oldFetch;

const mockFetch = () => {
  conditionalStorage().setItem('userToken', '1234');
  oldFetch = global.fetch;
  fetchMock = sinon.stub();
  global.fetch = fetchMock;
};

const unMockFetch = () => {
  global.fetch = oldFetch;
  conditionalStorage().clear();
};

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
  describe('changePage', () => {
    it('should return the correct action object', () => {
      const action = changePage('Testing');

      expect(action).to.eql({
        type: CHANGE_CLAIMS_PAGE,
        page: 'Testing',
      });
    });
  });
  describe('setUnavailable', () => {
    it('should return the correct action object', () => {
      const action = setUnavailable();

      expect(action).to.eql({
        type: SET_CLAIMS_UNAVAILABLE,
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
  describe('showMailOrFaxModal', () => {
    it('should return the correct action object', () => {
      const action = showMailOrFaxModal(true);

      expect(action).to.eql({
        type: SHOW_MAIL_OR_FAX,
        visible: true,
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
  describe('showConsolidatedMessage', () => {
    it('should return the correct action object', () => {
      const action = showConsolidatedMessage(true);

      expect(action).to.eql({
        type: SHOW_CONSOLIDATED_MODAL,
        visible: true,
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
      const oldWindow = global.window;
      global.window = { dataLayer: [] };
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
      global.window = oldWindow;
    });
  });
  describe('getAppeals', () => {
    beforeEach(mockFetch);
    it('should fetch claims', done => {
      const appeals = [];
      fetchMock.returns({
        catch: () => ({
          then: fn => fn({ ok: true, json: () => Promise.resolve(appeals) }),
        }),
      });
      const thunk = getAppeals();
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.eql(FETCH_APPEALS);
          expect(dispatchSpy.secondCall.args[0].type).to.eql(SET_APPEALS);
          done();
        }
      };

      thunk(dispatch);
    });
    it('should fail on error', done => {
      const appeals = [];
      fetchMock.returns({
        catch: () => ({
          then: fn =>
            fn({
              ok: false,
              status: 500,
              json: () => Promise.resolve(appeals),
            }),
        }),
      });
      const thunk = getAppeals();
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.eql(FETCH_APPEALS);
          expect(dispatchSpy.secondCall.args[0].type).to.eql(
            SET_APPEALS_UNAVAILABLE,
          );
          done();
        }
      };

      thunk(dispatch);
    });
    afterEach(unMockFetch);
  });
  describe('getClaimsV2', () => {
    it('should call dispatch and pollStatus', () => {
      const dispatchSpy = sinon.spy();
      const pollStatusSpy = sinon.spy();
      getClaimsV2(pollStatusSpy)(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({
        type: 'FETCH_CLAIMS_PENDING',
      });
      expect(pollStatusSpy.calledOnce).to.be.true;
    });

    describe('onError callback', () => {
      it('should dispatch a FETCH_CLAIMS_ERROR action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ errors: [] });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: 'FETCH_CLAIMS_ERROR',
        });
      });
    });
    describe('onSuccess callback', () => {
      it('should dispatch a FETCH_CLAIMS_SUCCESS action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [] });

        expect(dispatchSpy.secondCall.args[0]).to.eql({
          type: 'FETCH_CLAIMS_SUCCESS',
          claims: [],
          pages: 0,
        });
      });
    });
    describe('shouldFail predicate', () => {
      it('should return true when response.meta.syncStatus is FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({
          meta: { syncStatus: 'FAILED' },
        });

        expect(shouldFail).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({});

        expect(shouldFail).to.be.false;
      });
    });
    describe('shouldSucceed predicate', () => {
      it('should return true when response.meta.syncStatus is SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({
          meta: { syncStatus: 'SUCCESS' },
        });

        expect(shouldSucceed).to.be.true;
      });
      it('should return false when response.meta.syncStatus is not SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

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
    beforeEach(mockFetch);
    it('should submit request', done => {
      fetchMock.returns({
        catch: () => ({
          then: fn => fn({ ok: true, json: () => Promise.resolve() }),
        }),
      });
      const thunk = submitRequest(5);
      const dispatchSpy = sinon.spy();
      const dispatch = action => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 3) {
          expect(fetchMock.firstCall.args[1].method).to.equal('POST');
          expect(fetchMock.firstCall.args[0].endsWith('5/request_decision')).to
            .be.true;
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
      fetchMock.returns({
        catch: () => ({
          then: fn =>
            fn({ ok: false, status: 500, json: () => Promise.resolve() }),
        }),
      });
      const thunk = submitRequest(5);
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
    afterEach(unMockFetch);
  });
});
