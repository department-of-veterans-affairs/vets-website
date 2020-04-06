import sinon from 'sinon';

import {
  ADD_FILE,
  addFile,
  CANCEL_UPLOAD,
  cancelUpload,
  CHANGE_CLAIMS_PAGE,
  changePage,
  CLEAR_NOTIFICATION,
  clearNotification,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  clearAdditionalEvidenceNotification,
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
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
  setFieldsDirty,
  setLastPage,
  setNotification,
  setAdditionalEvidenceNotification,
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
  oldFetch = global.fetch;
  fetchMock = sinon.stub();
  global.fetch = fetchMock;
};

const unMockFetch = () => {
  global.fetch = oldFetch;
};

describe('Actions', () => {
  describe('setNotification', () => {
    test('should return the correct action object', () => {
      const action = setNotification('Testing');

      expect(action).toEqual({
        type: SET_NOTIFICATION,
        message: 'Testing',
      });
    });
  });
  describe('setAdditionalEvidenceNotification', () => {
    test('should return the correct action object', () => {
      const action = setAdditionalEvidenceNotification('Testing');

      expect(action).toEqual({
        type: SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
        message: 'Testing',
      });
    });
  });
  describe('changePage', () => {
    test('should return the correct action object', () => {
      const action = changePage('Testing');

      expect(action).toEqual({
        type: CHANGE_CLAIMS_PAGE,
        page: 'Testing',
      });
    });
  });
  describe('setUnavailable', () => {
    test('should return the correct action object', () => {
      const action = setUnavailable();

      expect(action).toEqual({
        type: SET_CLAIMS_UNAVAILABLE,
      });
    });
  });
  describe('resetUploads', () => {
    test('should return the correct action object', () => {
      const action = resetUploads();

      expect(action).toEqual({
        type: RESET_UPLOADS,
      });
    });
  });
  describe('addFile', () => {
    test('should return the correct action object', () => {
      const action = addFile('Testing');

      expect(action).toEqual({
        type: ADD_FILE,
        files: 'Testing',
      });
    });
  });
  describe('removeFile', () => {
    test('should return the correct action object', () => {
      const action = removeFile(1);

      expect(action).toEqual({
        type: REMOVE_FILE,
        index: 1,
      });
    });
  });
  describe('clearNotification', () => {
    test('should return the correct action object', () => {
      const action = clearNotification();

      expect(action).toEqual({
        type: CLEAR_NOTIFICATION,
      });
    });
  });
  describe('clearAdditionalEvidenceNotification', () => {
    test('should return the correct action object', () => {
      const action = clearAdditionalEvidenceNotification();

      expect(action).toEqual({
        type: CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
      });
    });
  });
  describe('updateField', () => {
    test('should return the correct action object', () => {
      const action = updateField('path', 'field');

      expect(action).toEqual({
        type: UPDATE_FIELD,
        path: 'path',
        field: 'field',
      });
    });
  });
  describe('showMailOrFaxModal', () => {
    test('should return the correct action object', () => {
      const action = showMailOrFaxModal(true);

      expect(action).toEqual({
        type: SHOW_MAIL_OR_FAX,
        visible: true,
      });
    });
  });
  describe('setFieldsDirty', () => {
    test('should return the correct action object', () => {
      const action = setFieldsDirty();

      expect(action).toEqual({
        type: SET_FIELDS_DIRTY,
      });
    });
  });
  describe('showConsolidatedMessage', () => {
    test('should return the correct action object', () => {
      const action = showConsolidatedMessage(true);

      expect(action).toEqual({
        type: SHOW_CONSOLIDATED_MODAL,
        visible: true,
      });
    });
  });
  describe('setLastPage', () => {
    test('should return the correct action object', () => {
      const action = setLastPage(2);

      expect(action).toEqual({
        type: SET_LAST_PAGE,
        page: 2,
      });
    });
  });
  describe('cancelUpload', () => {
    test('should call cancel on uploader', () => {
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

      expect(uploaderSpy.called).toBe(true);
      expect(dispatchSpy.firstCall.args[0].type).toBe(CANCEL_UPLOAD);
      global.window.dataLayer = oldDataLayer;
    });
  });
  describe('getAppeals', () => {
    beforeEach(mockFetch);
    test('should fetch claims', done => {
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
          expect(dispatchSpy.firstCall.args[0].type).toEqual(FETCH_APPEALS);
          expect(dispatchSpy.secondCall.args[0].type).toEqual(SET_APPEALS);
          done();
        }
      };

      thunk(dispatch);
    });
    test('should fail on error', done => {
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
          expect(dispatchSpy.firstCall.args[0].type).toEqual(FETCH_APPEALS);
          expect(dispatchSpy.secondCall.args[0].type).toEqual(
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
    test('should call dispatch and pollStatus', () => {
      const dispatchSpy = sinon.spy();
      const pollStatusSpy = sinon.spy();
      getClaimsV2(pollStatusSpy)(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).toEqual({
        type: 'FETCH_CLAIMS_PENDING',
      });
      expect(pollStatusSpy.calledOnce).toBe(true);
    });

    describe('onError callback', () => {
      test('should dispatch a FETCH_CLAIMS_ERROR action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ errors: [] });

        expect(dispatchSpy.secondCall.args[0]).toEqual({
          type: 'FETCH_CLAIMS_ERROR',
        });
      });
    });
    describe('onSuccess callback', () => {
      test('should dispatch a FETCH_CLAIMS_SUCCESS action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [] });

        expect(dispatchSpy.secondCall.args[0]).toEqual({
          type: 'FETCH_CLAIMS_SUCCESS',
          claims: [],
          pages: 0,
        });
      });
    });
    describe('shouldFail predicate', () => {
      test('should return true when response.meta.syncStatus is FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({
          meta: { syncStatus: 'FAILED' },
        });

        expect(shouldFail).toBe(true);
      });
      test('should return false when response.meta.syncStatus is not FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({});

        expect(shouldFail).toBe(false);
      });
    });
    describe('shouldSucceed predicate', () => {
      test('should return true when response.meta.syncStatus is SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimsV2(pollStatusSpy)(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({
          meta: { syncStatus: 'SUCCESS' },
        });

        expect(shouldSucceed).toBe(true);
      });
      test(
        'should return false when response.meta.syncStatus is not SUCCESS',
        () => {
          const dispatchSpy = sinon.spy();
          const pollStatusSpy = sinon.spy();
          getClaimsV2(pollStatusSpy)(dispatchSpy);

          const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({});

          expect(shouldSucceed).toBe(false);
        }
      );
    });
  });

  describe('getClaimDetail', () => {
    test('should call dispatch and pollStatus', () => {
      const dispatchSpy = sinon.spy();
      const pollStatusSpy = sinon.spy();
      getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).toEqual({ type: GET_CLAIM_DETAIL });
      expect(pollStatusSpy.calledOnce).toBe(true);
    });

    describe('onError callback', () => {
      test('should dispatch a SET_CLAIMS_UNAVAILABLE action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onError({ response: {} });

        expect(dispatchSpy.secondCall.args[0]).toEqual({
          type: 'SET_CLAIMS_UNAVAILABLE',
        });
      });
    });
    describe('onSuccess callback', () => {
      test('should dispatch a SET_CLAIM_DETAIL action', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        pollStatusSpy.firstCall.args[0].onSuccess({ data: [], meta: 'test' });

        expect(dispatchSpy.secondCall.args[0]).toEqual({
          type: SET_CLAIM_DETAIL,
          claim: [],
          meta: 'test',
        });
      });
    });
    describe('shouldFail predicate', () => {
      test('should return true when response.meta.syncStatus is FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({
          meta: { syncStatus: 'FAILED' },
        });

        expect(shouldFail).toBe(true);
      });
      test('should return false when response.meta.syncStatus is not FAILED', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldFail = pollStatusSpy.firstCall.args[0].shouldFail({});

        expect(shouldFail).toBe(false);
      });
    });
    describe('shouldSucceed predicate', () => {
      test('should return true when response.meta.syncStatus is SUCCESS', () => {
        const dispatchSpy = sinon.spy();
        const pollStatusSpy = sinon.spy();
        getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

        const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({
          meta: { syncStatus: 'SUCCESS' },
        });

        expect(shouldSucceed).toBe(true);
      });
      test(
        'should return false when response.meta.syncStatus is not SUCCESS',
        () => {
          const dispatchSpy = sinon.spy();
          const pollStatusSpy = sinon.spy();
          getClaimDetail(null, null, pollStatusSpy)(dispatchSpy);

          const shouldSucceed = pollStatusSpy.firstCall.args[0].shouldSucceed({});

          expect(shouldSucceed).toBe(false);
        }
      );
    });
  });

  describe('pollClaimStatus', () => {
    test('should call apiRequest', () => {
      const apiRequestSpy = sinon.spy();

      pollRequest({ request: apiRequestSpy });
      expect(apiRequestSpy.calledOnce).toBe(true);
    });
    describe('apiRequest response handler', () => {
      test('should call onSuccess when shouldSucceed returns true', () => {
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

        expect(onSuccessSpy.calledOnce).toBe(true);
        expect(onErrorSpy.called).toBe(false);
        expect(shouldSucceedStub.firstCall.args[0]).toEqual(mockResponse);
      });
      test(
        'should call onError when shouldSuccess return false shouldFail returns true',
        () => {
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

          expect(onSuccessSpy.calledOnce).toBe(false);
          expect(onErrorSpy.calledOnce).toBe(true);
          expect(shouldFailStub.firstCall.args[0]).toEqual(mockResponse);
        }
      );
    });
  });
  describe('submitRequest', () => {
    beforeEach(mockFetch);
    test('should submit request', done => {
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
          expect(fetchMock.firstCall.args[1].method).toBe('POST');
          expect(
            fetchMock.firstCall.args[0].endsWith('5/request_decision'),
          ).toBe(true);
          expect(dispatchSpy.firstCall.args[0]).toEqual({
            type: SUBMIT_DECISION_REQUEST,
          });
          expect(dispatchSpy.secondCall.args[0]).toEqual({
            type: SET_DECISION_REQUESTED,
          });
          expect(dispatchSpy.thirdCall.args[0].type).toEqual(SET_NOTIFICATION);
          done();
        }
      };

      thunk(dispatch);
    });
    test('should fail on error', done => {
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
          expect(dispatchSpy.firstCall.args[0]).toEqual({
            type: SUBMIT_DECISION_REQUEST,
          });
          expect(dispatchSpy.secondCall.args[0].type).toEqual(
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
