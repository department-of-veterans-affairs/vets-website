import { expect } from 'chai';
import sinon from 'sinon';

import {
  SET_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_IN_PROGRESS_FORM,
  SAVE_STATUSES,
  LOAD_STATUSES,
  setSaveFormStatus,
  setFetchFormStatus,
  setInProgressForm,
  migrateFormData,
  saveInProgressForm,
  fetchInProgressForm
} from '../../../src/js/common/schemaform/save-load-actions';

import { logOut } from '../../../src/js/login/actions';

let oldFetch;
let oldSessionStorage;
const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({ ok: true }));
};
const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
};

describe('Schemaform save / load actions:', () => {
  describe('setSaveFormStatus', () => {
    it('should return action', () => {
      const status = SAVE_STATUSES.success;
      const action = setSaveFormStatus(SAVE_STATUSES.success);

      expect(action.type).to.equal(SET_SAVE_FORM_STATUS);
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
        field: 'stuff'
      };
      const migrations = [
        (savedData) => {
          savedData.field = savedData.field.toUpperCase(); // eslint-disable-line no-param-reassign
          return savedData;
        }
      ];
      const migratedData = migrateFormData(data, 0, migrations);

      expect(migratedData).to.eql({
        field: 'STUFF'
      });
    });
    it('should migrate multiple times', () => {
      const data = {
        field: 'stuff'
      };
      const migrations = [
        (savedData) => {
          savedData.field = savedData.field.toUpperCase(); // eslint-disable-line no-param-reassign
          return savedData;
        },
        (savedData) => {
          savedData.field = `${savedData.field} to do`; // eslint-disable-line no-param-reassign
          return savedData;
        }
      ];
      const migratedData = migrateFormData(data, 0, migrations);

      expect(migratedData).to.eql({
        field: 'STUFF to do'
      });
    });
  });
  describe('saveInProgressForm', () => {
    beforeEach(setup);
    afterEach(teardown);

    it('dispatches a no-auth if the user has no session token', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      delete sessionStorage.userToken;

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.false;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('dispatches a pending', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('calls the api to save the form', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      thunk(dispatch).then(() => {
        expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('dispatches a success if the form is saved', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true
      }));

      thunk(dispatch).then(() => {
        expect(dispatch.secondCall.args[0].status).to.equal(SAVE_STATUSES.success);
        expect(dispatch.secondCall.args[0].type).to.equal(SET_SAVE_FORM_STATUS);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('dispatches a no-auth if the api returns a 401', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.reset();
      global.fetch.returns(Promise.resolve(new Response(null, {
        status: 401
      })));

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
        expect(dispatch.calledWith(logOut())).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('dispatches a failure on any other failure', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve(new Response(null, {
        status: 404
      })));

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('dispatches a failure when a network error occurs', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.reject(new Error('No network connection')));

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('fetchInProgressForm', () => {
    beforeEach(setup);
    afterEach(teardown);

    it('dispatches a no-auth if the user has no session token', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      delete sessionStorage.userToken;

      return thunk(dispatch).then(() => {
        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth))).to.be.true;
      });
    });
    it('dispatches a pending', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        // Only testing for pending status, so failing is the quickest way
        ok: false
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.pending))).to.be.true;
      });
    });
    it('attempts to fetch an in-progress form', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      thunk(dispatch).then(() => {
        expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
      });
    });
    it('dispaches a success if the form is loaded', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        json: () => ({
          form_data: { field: 'foo' }, // eslint-disable-line camelcase
          metadata: {
            version: 0
          }
        })
      }));

      return thunk(dispatch).then(() => {
        expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
      });
    });
    it('dispatches a no-auth if the api returns a 401', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 401
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledThrice).to.be.true;
        expect(dispatch.calledWith(logOut())).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth))).to.be.true;
      });
    });
    it('dispatches a not-found if the api returns a 404', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 404
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.notFound))).to.be.true;
      });
    });
    it('dispatches a not-found if the api returns an empty object', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        json: () => ({}) // Return an empty object
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.notFound))).to.be.true;
      });
    });
    it("dispatches an invalid-data if the data returned from the api isn't an object", () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        json: () => ([]) // Return not an object
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.invalidData))).to.be.true;
      });
    });
    it("dispatches an invalid-data if the api doesn't return valid json", () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        // if res.json() fails, it rejects with a SyntaxError
        json: () => (Promise.reject(new SyntaxError('Error parsing json')))
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.invalidData))).to.be.true;
      });
    });
    it('dispatches a failure on api response error', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 500
      }));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.failure))).to.be.true;
      });
    });
    it('dispatches a failure on network error', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.reject(new Error('No network connection')));

      return thunk(dispatch).then(() => {
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.failure))).to.be.true;
      });
    });
  });
});
