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
  getStemClaims,
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
  REMOVE_FILE,
  RESET_UPLOADS,
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
