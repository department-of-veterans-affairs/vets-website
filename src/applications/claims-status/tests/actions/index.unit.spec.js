import { expect } from 'chai';
import sinon from 'sinon';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import * as constants from '../../constants';

import {
  addFile,
  cancelUpload,
  clearAdditionalEvidenceNotification,
  clearNotification,
  getClaims,
  getClaim,
  getClaimLetters,
  getStemClaims,
  removeFile,
  resetUploads,
  setAdditionalEvidenceNotification,
  setFieldsDirty,
  setLastPage,
  setNotification,
  submitRequest,
  updateField,
  submit5103,
} from '../../actions';

import {
  ADD_FILE,
  CANCEL_UPLOAD,
  CLEAR_NOTIFICATION,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
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
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_SUCCESS,
  FETCH_STEM_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
} from '../../actions/types';

describe('Actions', () => {
  describe('getClaimLetters', () => {
    it('should get claim letters', () => {
      const apiStub = sinon.stub(api, 'apiRequest');

      apiStub.returns(Promise.resolve({ data: [] }));

      getClaimLetters();
      expect(apiStub.called).to.be.true;
      apiStub.restore();
    });
  });
  describe('submit5103', () => {
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

    context('when cstClaimPhasesEnabled is true', () => {
      it('should submit request and set notification', done => {
        const ID = 5;
        server.use(
          rest.post(
            `https://dev-api.va.gov/v0/benefits_claims/${ID}/submit5103`,
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

        const thunk = submit5103(ID, true);
        const dispatchSpy = sinon.spy();
        const dispatch = action => {
          dispatchSpy(action);
          if (dispatchSpy.callCount === 3) {
            expect(expectedUrl).to.contain('5/submit5103');
            expect(dispatchSpy.firstCall.args[0]).to.eql({
              type: SUBMIT_DECISION_REQUEST,
            });
            expect(dispatchSpy.secondCall.args[0]).to.eql({
              type: SET_DECISION_REQUESTED,
            });
            expect(dispatchSpy.thirdCall.args[0].type).to.eql(SET_NOTIFICATION);
            expect(dispatchSpy.thirdCall.args[0].message.title).to.eql(
              'We received your evidence waiver',
            );
            expect(dispatchSpy.thirdCall.args[0].message.body).to.eql(
              'Thank you. We’ll move your claim to the next step as soon as possible.',
            );
            done();
          }
        };

        thunk(dispatch);
      });
    });

    context('when cstClaimPhasesEnabled is false', () => {
      it('should submit request and set notification', done => {
        const ID = 5;
        server.use(
          rest.post(
            `https://dev-api.va.gov/v0/benefits_claims/${ID}/submit5103`,
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

        const thunk = submit5103(ID);
        const dispatchSpy = sinon.spy();
        const dispatch = action => {
          dispatchSpy(action);
          if (dispatchSpy.callCount === 3) {
            expect(expectedUrl).to.contain('5/submit5103');
            expect(dispatchSpy.firstCall.args[0]).to.eql({
              type: SUBMIT_DECISION_REQUEST,
            });
            expect(dispatchSpy.secondCall.args[0]).to.eql({
              type: SET_DECISION_REQUESTED,
            });
            expect(dispatchSpy.thirdCall.args[0].type).to.eql(SET_NOTIFICATION);
            expect(dispatchSpy.thirdCall.args[0].message.title).to.eql(
              'Request received',
            );
            expect(dispatchSpy.thirdCall.args[0].message.body).to.eql(
              'Thank you. We have your claim request and will make a decision.',
            );
            done();
          }
        };

        thunk(dispatch);
      });

      it('should fail on error', done => {
        const ID = 5;
        server.use(
          rest.post(
            `https://dev-api.va.gov/v0/benefits_claims/${ID}/submit5103`,
            (req, res, ctx) => res(ctx.status(400), ctx.json({ status: 400 })),
          ),
        );
        const thunk = submit5103(ID);
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
  });
  describe('getClaim', () => {
    it('dispatches GET_CLAIM_DETAIL and SET_CLAIM_DETAIL', done => {
      const apiStub = sinon.stub(api, 'apiRequest');

      apiStub.returns(Promise.resolve({ data: [] }));
      const thunk = getClaim(1);
      const dispatch = sinon.spy();

      thunk(dispatch)
        .then(() => {
          const action = dispatch.firstCall.args[0];

          expect(action.type).to.equal(GET_CLAIM_DETAIL);
          expect(dispatch.secondCall.args[0]).to.eql({
            type: SET_CLAIM_DETAIL,
            claim: [],
          });
        })
        .then(() => apiStub.restore())
        .then(done, done);
    });
    it('dispatches SET_CLAIMS_UNAVAILABLE', done => {
      const thunk = getClaim(1);
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.secondCall.args[0];
          expect(action.type).to.equal(SET_CLAIMS_UNAVAILABLE);
        })
        .then(done, done);
    });
    it('navigates to `/your-claims` when errors on 404 ', done => {
      const apiStub = sinon.stub(api, 'apiRequest');

      apiStub.returns(Promise.reject({ status: 404 }));

      const navigate = sinon.spy();

      const thunk = getClaim(1, navigate);
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.firstCall.args[0];

          expect(action.type).to.equal(GET_CLAIM_DETAIL);
          expect(navigate.called).to.be.true;
        })
        .then(() => apiStub.restore())
        .then(done, done);
    });
  });
  describe('getClaims', () => {
    it('dispatches FETCH_CLAIMS_PENDING and FETCH_CLAIMS_SUCCESS', done => {
      const apiStub = sinon.stub(api, 'apiRequest');
      apiStub.returns(Promise.resolve({ data: [] }));
      const thunk = getClaims();
      const dispatch = sinon.spy();

      thunk(dispatch)
        .then(() => {
          const action = dispatch.firstCall.args[0];

          expect(action.type).to.equal(FETCH_CLAIMS_PENDING);
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_CLAIMS_SUCCESS,
            claims: [],
          });
        })
        .then(() => apiStub.restore())
        .then(done, done);
    });
    it('dispatches FETCH_CLAIMS_ERROR - null', done => {
      const apiStub = sinon.stub(api, 'apiRequest');

      apiStub.returns(Promise.reject(null));

      const thunk = getClaims();
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.secondCall.args[0];
          expect(action.type).to.equal(FETCH_CLAIMS_ERROR);
        })
        .then(() => apiStub.restore())
        .then(done, done);
    });
    it('dispatches FETCH_CLAIMS_ERROR - not null error code', done => {
      const apiStub = sinon.stub(api, 'apiRequest');

      apiStub.returns(Promise.reject({ errors: [{ status: 404 }] }));

      const thunk = getClaims();
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.secondCall.args[0];
          expect(action.type).to.equal(FETCH_CLAIMS_ERROR);
        })
        .then(() => apiStub.restore())
        .then(done, done);
    });
  });
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
    context('when cstClaimPhasesEnabled is false', () => {
      it('should submit request with canUseMocks true', done => {
        const useMocksStub = sinon.stub(constants, 'canUseMocks').returns(true);

        const thunk = submitRequest(5);
        const dispatch = sinon.spy();

        thunk(dispatch)
          .then(() => {
            expect(dispatch.firstCall.args[0].type).to.equal(
              SUBMIT_DECISION_REQUEST,
            );
            expect(dispatch.secondCall.args[0].type).to.equal(
              SET_DECISION_REQUESTED,
            );
          })
          .then(() => useMocksStub.restore())
          .then(done, done);
      });
    });

    context('when cstClaimPhasesEnabled is true', () => {
      it('should submit request with canUseMocks true', done => {
        const useMocksStub = sinon.stub(constants, 'canUseMocks').returns(true);

        const thunk = submitRequest(5, true);
        const dispatch = sinon.spy();

        thunk(dispatch)
          .then(() => {
            expect(dispatch.firstCall.args[0].type).to.equal(
              SUBMIT_DECISION_REQUEST,
            );
            expect(dispatch.secondCall.args[0].type).to.equal(
              SET_DECISION_REQUESTED,
            );
          })
          .then(() => useMocksStub.restore())
          .then(done, done);
      });
    });

    context('', () => {
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

      context('when cstClaimPhasesEnabled is false', () => {
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
              expect(dispatchSpy.thirdCall.args[0].type).to.eql(
                SET_NOTIFICATION,
              );
              expect(dispatchSpy.thirdCall.args[0].message.title).to.eql(
                'Request received',
              );
              expect(dispatchSpy.thirdCall.args[0].message.body).to.eql(
                'Thank you. We have your claim request and will make a decision.',
              );
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
              (req, res, ctx) =>
                res(ctx.status(400), ctx.json({ status: 400 })),
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

      context('when cstClaimPhasesEnabled is true', () => {
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

          const thunk = submitRequest(ID, true);
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
              expect(dispatchSpy.thirdCall.args[0].type).to.eql(
                SET_NOTIFICATION,
              );
              expect(dispatchSpy.thirdCall.args[0].message.title).to.eql(
                'We received your evidence waiver',
              );
              expect(dispatchSpy.thirdCall.args[0].message.body).to.eql(
                'Thank you. We’ll move your claim to the next step as soon as possible.',
              );
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
              (req, res, ctx) =>
                res(ctx.status(400), ctx.json({ status: 400 })),
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
    });
  });

  describe('getStemClaims', () => {
    const server = setupServer();

    before(() => {
      server.listen({ onUnhandledRequest: 'bypass' });
    });

    afterEach(() => {
      server.resetHandlers();
    });

    after(() => server.close());

    it('should fetch stem claims when canUseMocks true', done => {
      const useMocksStub = sinon.stub(constants, 'canUseMocks').returns(true);
      const thunk = getStemClaims();
      const dispatch = sinon.spy();

      thunk(dispatch)
        .then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            FETCH_STEM_CLAIMS_PENDING,
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            FETCH_STEM_CLAIMS_SUCCESS,
          );
        })
        .then(() => useMocksStub.restore())
        .then(done, done);
    });

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
