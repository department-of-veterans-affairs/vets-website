import { expect } from 'chai';
import sinon from 'sinon';

import {
  SET_NOTIFICATION,
  setNotification,
  changePage,
  CHANGE_CLAIMS_PAGE,
  setUnavailable,
  SET_UNAVAILABLE,
  resetUploads,
  RESET_UPLOADS,
  addFile,
  ADD_FILE,
  removeFile,
  REMOVE_FILE,
  clearNotification,
  CLEAR_NOTIFICATION,
  updateField,
  UPDATE_FIELD,
  showMailOrFaxModal,
  SHOW_MAIL_OR_FAX,
  setFieldsDirty,
  SET_FIELDS_DIRTY,
  showConsolidatedMessage,
  SHOW_CONSOLIDATED_MODAL,
  setLastPage,
  SET_LAST_PAGE,
  cancelUpload,
  CANCEL_UPLOAD,
  getClaims,
  SET_CLAIMS,
  getClaimDetail,
  SET_CLAIM_DETAIL,
  GET_CLAIM_DETAIL,
  submitRequest,
  SUBMIT_DECISION_REQUEST,
  SET_DECISION_REQUESTED,
  SET_DECISION_REQUEST_ERROR
} from '../../src/js/disability-benefits/actions';

let fetchMock;
let oldFetch;

const mockFetch = () => {
  global.sessionStorage = { userToken: '1234' };
  oldFetch = global.fetch;
  fetchMock = sinon.stub();
  global.fetch = fetchMock;
};

const unMockFetch = () => {
  global.fetch = oldFetch;
};

describe('Actions', () => {
  describe('setNotification', () => {
    it('should return the correct action object', () => {
      const action = setNotification('Testing');

      expect(action).to.eql({
        type: SET_NOTIFICATION,
        message: 'Testing'
      });
    });
  });
  describe('changePage', () => {
    it('should return the correct action object', () => {
      const action = changePage('Testing');

      expect(action).to.eql({
        type: CHANGE_CLAIMS_PAGE,
        page: 'Testing'
      });
    });
  });
  describe('setUnavailable', () => {
    it('should return the correct action object', () => {
      const action = setUnavailable();

      expect(action).to.eql({
        type: SET_UNAVAILABLE,
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
        files: 'Testing'
      });
    });
  });
  describe('removeFile', () => {
    it('should return the correct action object', () => {
      const action = removeFile(1);

      expect(action).to.eql({
        type: REMOVE_FILE,
        index: 1
      });
    });
  });
  describe('clearNotification', () => {
    it('should return the correct action object', () => {
      const action = clearNotification();

      expect(action).to.eql({
        type: CLEAR_NOTIFICATION
      });
    });
  });
  describe('updateField', () => {
    it('should return the correct action object', () => {
      const action = updateField('path', 'field');

      expect(action).to.eql({
        type: UPDATE_FIELD,
        path: 'path',
        field: 'field'
      });
    });
  });
  describe('showMailOrFaxModal', () => {
    it('should return the correct action object', () => {
      const action = showMailOrFaxModal(true);

      expect(action).to.eql({
        type: SHOW_MAIL_OR_FAX,
        visible: true
      });
    });
  });
  describe('setFieldsDirty', () => {
    it('should return the correct action object', () => {
      const action = setFieldsDirty();

      expect(action).to.eql({
        type: SET_FIELDS_DIRTY
      });
    });
  });
  describe('showConsolidatedMessage', () => {
    it('should return the correct action object', () => {
      const action = showConsolidatedMessage(true);

      expect(action).to.eql({
        type: SHOW_CONSOLIDATED_MODAL,
        visible: true
      });
    });
  });
  describe('setLastPage', () => {
    it('should return the correct action object', () => {
      const action = setLastPage(2);

      expect(action).to.eql({
        type: SET_LAST_PAGE,
        page: 2
      });
    });
  });
  describe('cancelUpload', () => {
    it('should call cancel on uploader', () => {
      const thunk = cancelUpload();
      const uploaderSpy = sinon.spy();
      const dispatchSpy = sinon.spy();
      const getState = () => {
        return {
          uploads: {
            uploader: {
              cancelAll: uploaderSpy
            }
          }
        };
      };

      thunk(dispatchSpy, getState);

      expect(uploaderSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0].type).to.equal(CANCEL_UPLOAD);
    });
  });
  describe('getClaims', () => {
    beforeEach(mockFetch);
    it('should fetch claims', (done) => {
      const claims = [];
      fetchMock.returns({
        then: (fn) => fn({ ok: true, json: () => Promise.resolve(claims) })
      });
      const thunk = getClaims();
      const dispatch = (action) => {
        expect(action.type).to.equal(SET_CLAIMS);
        done();
      };

      thunk(dispatch);
    });
    it('should fail on error', (done) => {
      const claims = [];
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 500, json: () => Promise.resolve(claims) })
      });
      const thunk = getClaims();
      const dispatch = (action) => {
        expect(action.type).to.equal(SET_UNAVAILABLE);
        done();
      };

      thunk(dispatch);
    });
    afterEach(unMockFetch);
  });
  describe('getClaimDetail', () => {
    beforeEach(mockFetch);
    it('should fetch claim', (done) => {
      const claim = { data: {}, meta: {} };
      fetchMock.returns({
        then: (fn) => fn({ ok: true, json: () => Promise.resolve(claim) })
      });
      const thunk = getClaimDetail();
      const dispatchSpy = sinon.spy();
      const dispatch = (action) => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: GET_CLAIM_DETAIL
          });
          expect(dispatchSpy.secondCall.args[0]).to.eql({
            type: SET_CLAIM_DETAIL,
            claim: claim.data,
            meta: claim.meta
          });
          done();
        }
      };

      thunk(dispatch);
    });
    it('should fail on 500 error', (done) => {
      const claim = { data: {}, meta: {} };
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 500, json: () => Promise.resolve(claim) })
      });
      const thunk = getClaimDetail();
      const dispatchSpy = sinon.spy();
      const dispatch = (action) => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: GET_CLAIM_DETAIL
          });
          expect(dispatchSpy.secondCall.args[0]).to.eql({
            type: SET_UNAVAILABLE,
          });
          done();
        }
      };

      thunk(dispatch);
    });
    it('should redirect on 404 error', (done) => {
      const claim = { data: {}, meta: {} };
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 404, json: () => Promise.resolve(claim) })
      });
      const dispatchSpy = sinon.spy();
      const routerSpy = (path) => {
        expect(dispatchSpy.firstCall.args[0]).to.eql({
          type: GET_CLAIM_DETAIL
        });
        expect(path).to.equal('your-claims');
        done();
      };
      const thunk = getClaimDetail(5, { replace: routerSpy });

      thunk(dispatchSpy);
    });
    afterEach(unMockFetch);
  });
  describe('submitRequest', () => {
    beforeEach(mockFetch);
    it('should submit request', (done) => {
      fetchMock.returns({
        then: (fn) => fn({ ok: true, json: () => Promise.resolve() })
      });
      const thunk = submitRequest(5);
      const dispatchSpy = sinon.spy();
      const dispatch = (action) => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 3) {
          expect(fetchMock.firstCall.args[1].method).to.equal('POST');
          expect(fetchMock.firstCall.args[0].endsWith('5/request_decision')).to.be.true;
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: SUBMIT_DECISION_REQUEST
          });
          expect(dispatchSpy.secondCall.args[0]).to.eql({
            type: SET_DECISION_REQUESTED
          });
          expect(dispatchSpy.thirdCall.args[0].type).to.eql(SET_NOTIFICATION);
          done();
        }
      };

      thunk(dispatch);
    });
    it('should fail on error', (done) => {
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 500, json: () => Promise.resolve() })
      });
      const thunk = submitRequest(5);
      const dispatchSpy = sinon.spy();
      const dispatch = (action) => {
        dispatchSpy(action);
        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0]).to.eql({
            type: SUBMIT_DECISION_REQUEST
          });
          expect(dispatchSpy.secondCall.args[0].type).to.eql(SET_DECISION_REQUEST_ERROR);
          done();
        }
      };

      thunk(dispatch);
    });
    afterEach(unMockFetch);
  });
});
