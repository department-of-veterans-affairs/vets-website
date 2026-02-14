import { expect } from 'chai';
import sinon from 'sinon';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { server, rest } from '../mock-sip-handlers';

import {
  SET_SAVE_FORM_STATUS,
  SET_AUTO_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_IN_PROGRESS_FORM,
  SAVE_STATUSES,
  LOAD_STATUSES,
  setSaveFormStatus,
  setFetchFormStatus,
  setInProgressForm,
  migrateFormData,
  saveAndRedirectToReturnUrl,
  fetchInProgressForm,
  removeInProgressForm,
  setPrefillComplete,
  setFetchFormPending,
  setStartOver,
} from '../../save-in-progress/actions';

import { logOut } from '../../../user/authentication/actions';
import { inProgressApi } from '../../helpers';

const getState = () => ({ form: { trackingPrefix: 'test' } });

describe('Schemaform save / load actions:', () => {
  describe('setSaveFormStatus', () => {
    it('should return action', () => {
      const status = SAVE_STATUSES.success;
      const action = setSaveFormStatus(
        'saveAndRedirect',
        SAVE_STATUSES.success,
      );

      expect(action.type).to.equal(SET_SAVE_FORM_STATUS);
      expect(action.status).to.equal(status);
    });
    it('should return different action for auto saveType', () => {
      const status = SAVE_STATUSES.success;
      const action = setSaveFormStatus('auto', SAVE_STATUSES.success);

      expect(action.type).to.equal(SET_AUTO_SAVE_FORM_STATUS);
      expect(action.status).to.equal(status);
    });
  });
  describe('setFetchFormStatus', () => {
    it('should return action', () => {
      const status = LOAD_STATUSES.success;
      const action = setFetchFormStatus(status);

      expect(action.type).to.equal(SET_FETCH_FORM_STATUS);
      expect(action.status).to.equal(status);
    });
  });
  describe('setInProgressForm', () => {
    it('should return action', () => {
      const data = {};
      const action = setInProgressForm(data);

      expect(action.type).to.equal(SET_IN_PROGRESS_FORM);
      expect(action.data).to.equal(data);
    });
  });
  describe('migrateFormData', () => {
    it('should return migrated data', () => {
      const data = {
        formData: {
          field: 'stuff',
        },
        metadata: {
          version: 0,
        },
      };
      const migrations = [
        savedData => {
          savedData.formData.field = savedData.formData.field.toUpperCase(); // eslint-disable-line no-param-reassign
          return savedData;
        },
      ];
      const migratedData = migrateFormData(data, migrations);

      expect(migratedData).to.eql({
        formData: {
          field: 'STUFF',
        },
        metadata: {
          version: 0,
        },
      });
    });
    it('should migrate multiple times', () => {
      const data = {
        formData: {
          field: 'stuff',
        },
        metadata: {
          version: 0,
        },
      };
      const migrations = [
        savedData => {
          savedData.formData.field = savedData.formData.field.toUpperCase(); // eslint-disable-line no-param-reassign
          return savedData;
        },
        savedData => {
          savedData.formData.field = `${savedData.formData.field} to do`; // eslint-disable-line no-param-reassign
          return savedData;
        },
      ];
      const migratedData = migrateFormData(data, migrations);

      expect(migratedData).to.eql({
        formData: {
          field: 'STUFF to do',
        },
        metadata: {
          version: 0,
        },
      });
    });
  });
  describe('saveAndRedirectToReturnUrl', () => {
    // Global server is managed by mocha-setup.js (listen/close)
    // Use server.use() to add handlers, resetHandlers() happens automatically in beforeEach

    const mockedSuccessData = {
      data: {
        id: '1010EZ',
        type: '10-10EZ Save in Progress',
        attributes: {
          formId: VA_FORM_IDS.FORM_10_10EZ,
          createdAt: 'today',
          updatedAt: 'yesterday',
          metadata: {},
        },
      },
    };

    it('dispatches a pending', done => {
      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(
            dispatch.calledWith(
              setSaveFormStatus('saveAndRedirect', SAVE_STATUSES.pending),
            ),
          ).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('calls the api to save the form', done => {
      let capturedURL;
      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          capturedURL = req.url.href;
          return res(ctx.status(200), ctx.json(mockedSuccessData));
        }),
      );

      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(capturedURL).to.contain('/v0/in_progress_forms/1010ez');
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('calls the Form 526-specific api to save the form', done => {
      let capturedURL;
      const mocked526Data = {
        data: {
          id: '526EZ',
          type: 'Disablity Save in Progress',
          attributes: {
            formId: VA_FORM_IDS.FORM_21_526EZ,
            createdAt: 'today',
            updatedAt: 'yesterday',
            metadata: {},
          },
        },
      };

      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_21_526EZ), (req, res, ctx) => {
          capturedURL = req.url.href;
          return res(ctx.status(200), ctx.json(mocked526Data));
        }),
      );
      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_21_526EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(capturedURL).to.contain(
            inProgressApi(VA_FORM_IDS.FORM_21_526EZ),
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a success if the form is saved', done => {
      const mockedData = {
        data: {
          id: '1010EZ',
          attributes: {
            metadata: {
              expiresAt: 1507504729,
              lastUpdated: 1502320729,
              returnUrl: '/veteran-information/personal-information',
              savedAt: 1502320728979,
              version: 0,
            },
          },
        },
      };
      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockedData));
        }),
      );
      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.secondCall.args[0].status).to.equal(
            SAVE_STATUSES.success,
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            SET_SAVE_FORM_STATUS,
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a no-auth if the api returns a 401', done => {
      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ status: 401 }));
        }),
      );
      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(
            dispatch.calledWith(
              setSaveFormStatus('saveAndRedirect', SAVE_STATUSES.noAuth),
            ),
          ).to.be.true;
          expect(dispatch.calledWith(logOut())).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a failure on any other failure', done => {
      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ status: 500 }));
        }),
      );

      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(
            dispatch.calledWith(
              setSaveFormStatus('saveAndRedirect', SAVE_STATUSES.failure),
            ),
          ).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it('dispatches a client failure when a network error occurs', done => {
      server.use(
        rest.put(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res) => {
          return res.networkError('SIP Network Error');
        }),
      );
      const thunk = saveAndRedirectToReturnUrl(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      thunk(dispatch, getState)
        .then(() => {
          expect(
            dispatch.calledWith(
              setSaveFormStatus('saveAndRedirect', SAVE_STATUSES.clientFailure),
            ),
          ).to.be.true;
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });
  describe('fetchInProgressForm', () => {
    // Global server is managed by mocha-setup.js (listen/close)

    const mockedSuccessGetData = {
      formData: {
        formData: { field: 'foo' },
      },
      metadata: {
        version: 0,
        prefill: true,
      },
    };
    it('dispatches a pending', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ test: 'test' }));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledWith(setFetchFormPending(false))).to.be.true;
      });
    });
    it('attempts to fetch an in-progress form', () => {
      let capturedURL;
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          capturedURL = req.url.href;
          return res(ctx.status(200), ctx.json({ test: 'test' }));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedURL).to.contain(inProgressApi(VA_FORM_IDS.FORM_10_10EZ));
      });
    });
    it('dispatches a success if the form is loaded', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockedSuccessGetData));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(
          dispatch.calledWith(
            setInProgressForm({
              ...mockedSuccessGetData,
            }),
          ),
        ).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.success)))
          .to.be.true;
      });
    });
    it('dispatches a success from the form 526-specific api on form load', () => {
      let capturedURL;
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_21_526EZ), (req, res, ctx) => {
          capturedURL = req.url.href;
          return res(ctx.status(200), ctx.json(mockedSuccessGetData));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_21_526EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedURL).to.contain(
          inProgressApi(VA_FORM_IDS.FORM_21_526EZ),
        );
        expect(
          dispatch.calledWith(
            setInProgressForm({
              ...mockedSuccessGetData,
            }),
          ),
        ).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.success)))
          .to.be.true;
      });
    });
    it('dispatches: `no-auth` if the API returns a 401', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          // ctx.json({ status }) is a workaround for isomorphicFetch bug
          return res(ctx.status(401), ctx.json({ status: 401 }));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledThrice).to.be.true;
        expect(dispatch.calledWith(logOut())).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth))).to
          .be.true;
      });
    });
    it('dispatches: `not-found` if the API returns a 404', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ status: 404 }));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.notFound)))
          .to.be.true;
      });
    });
    it('dispatches: `not-found` if the API returns an empty object', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.notFound)))
          .to.be.true;
      });
    });
    it("dispatches: `invalid-data` if the API return value isn't an object", () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]));
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(
          dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.invalidData)),
        ).to.be.true;
      });
    });
    it('dispatches: `failure` if there is an error (including NetworkError)', () => {
      server.use(
        rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res) => {
          return res.networkError('SIP Network Error');
        }),
      );
      const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.failure)))
          .to.be.true;
      });
    });

    describe('prefill', () => {
      it('dispatches a no-auth if the api returns a 401', () => {
        server.use(
          rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
            return res(ctx.status(401), ctx.json({ status: 401 }));
          }),
        );
        const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {}, true);
        const dispatch = sinon.spy();

        return thunk(dispatch, getState).then(() => {
          expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth)))
            .to.be.true;
        });
      });
      it('dispatches a success if the api returns a 404', () => {
        server.use(
          rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
            return res(ctx.status(404));
          }),
        );
        const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {}, true);
        const dispatch = sinon.spy();

        return thunk(dispatch, getState).then(() => {
          expect(dispatch.calledWith(setPrefillComplete())).to.be.true;
        });
      });
      it('dispatches a success if the api returns an empty object', () => {
        server.use(
          rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
            return res(ctx.status(401), ctx.json({}));
          }),
        );
        const thunk = fetchInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {}, true);
        const dispatch = sinon.spy();

        return thunk(dispatch, getState).then(() => {
          expect(dispatch.calledWith(setPrefillComplete())).to.be.true;
        });
      });
      it('calls prefill transform when response is prefilled', () => {
        server.use(
          rest.get(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                formData: {},
                metadata: {
                  prefill: true,
                },
              }),
            );
          }),
        );
        const prefillTransformer = sinon.spy();
        const thunk = fetchInProgressForm(
          VA_FORM_IDS.FORM_10_10EZ,
          {},
          true,
          prefillTransformer,
        );
        const dispatch = sinon.spy();

        return thunk(dispatch, getState).then(() => {
          expect(prefillTransformer.called).to.be.true;
          expect(dispatch.calledWith(setPrefillComplete())).to.be.true;
        });
      });
    });
  });
  describe('removeInProgressForm', () => {
    window.dataLayer = [];
    // Global server is managed by mocha-setup.js (listen/close)

    it('dispatches a start over action', () => {
      server.use(
        rest.delete(
          inProgressApi(VA_FORM_IDS.FORM_10_10EZ),
          (req, res, ctx) => {
            return res(ctx.status(200));
          },
        ),
      );
      const thunk = removeInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(dispatch.calledWith(setStartOver())).to.be.true;
      });
    });
    it('attempts to remove an in-progress form', () => {
      let capturedURL;
      let capturedMethod;
      server.use(
        rest.delete(
          inProgressApi(VA_FORM_IDS.FORM_10_10EZ),
          (req, res, ctx) => {
            capturedURL = req.url.href;
            capturedMethod = req.method;
            return res(ctx.status(200));
          },
        ),
      );
      const thunk = removeInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedURL).to.contain(inProgressApi(VA_FORM_IDS.FORM_10_10EZ));
        expect(capturedMethod).to.equal('DELETE');
      });
    });
    it('removes a form and fetches prefill data', () => {
      let capturedMethod;
      const mockedData = {
        data: {
          id: '1',
          type: '10-10EZ Save in Progress Delete',
          attributes: {
            formId: VA_FORM_IDS.FORM_10_10EZ,
            createdAt: 'today',
            updatedAt: 'yesterday',
            metadata: {},
          },
        },
      };
      server.use(
        rest.delete(
          inProgressApi(VA_FORM_IDS.FORM_10_10EZ),
          (req, res, ctx) => {
            capturedMethod = req.method;
            return res(ctx.status(200), ctx.json(mockedData));
          },
        ),
      );
      const thunk = removeInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedMethod).to.equal('DELETE');
        expect(dispatch.lastCall.args[0]).to.be.a('function');
      });
    });
    it('handles remove error and fetches prefill data', () => {
      let capturedMethod;
      server.use(
        rest.delete(inProgressApi(VA_FORM_IDS.FORM_10_10EZ), (req, res) => {
          capturedMethod = req.method;
          return res.networkError('Network Error');
        }),
      );
      const thunk = removeInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedMethod).to.equal('DELETE');
        expect(dispatch.lastCall.args[0]).to.be.a('function');
      });
    });
    it('sets no-auth status if session expires', () => {
      let capturedMethod;
      server.use(
        rest.delete(
          inProgressApi(VA_FORM_IDS.FORM_10_10EZ),
          (req, res, ctx) => {
            capturedMethod = req.method;
            return res(ctx.status(401), ctx.json({ status: 401 }));
          },
        ),
      );
      const thunk = removeInProgressForm(VA_FORM_IDS.FORM_10_10EZ, {});
      const dispatch = sinon.spy();

      return thunk(dispatch, getState).then(() => {
        expect(capturedMethod).to.equal('DELETE');
        expect(dispatch.calledWith(logOut()));
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth)));
        expect(dispatch.lastCall.args[0]).not.to.be.a('function');
      });
    });
  });
});
