import { expect } from 'chai';
import sinon from 'sinon';

import {
  SET_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_IN_PROGRESS_FORM,
  LOAD_DATA_INTO_FORM,
  SAVE_STATUSES,
  LOAD_STATUSES,
  setSaveFormStatus,
  setFetchFormStatus,
  setInProgressForm,
  loadInProgressDataIntoForm,
  migrateFormData,
  saveInProgressForm,
  fetchInProgressForm
} from '../../../src/js/common/schemaform/save-load-actions';


let oldFetch;
let oldSessionStorage;
const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({ okay: true }));
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
  describe('loadInProgressDataIntoForm', () => {
    it('should return action', () => {
      const action = loadInProgressDataIntoForm();

      expect(action.type).to.equal(LOAD_DATA_INTO_FORM);
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

    it('dispatches a no-auth if the user has no session token', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      delete sessionStorage.userToken;

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.false;
      });
    });
    it('dispatches a pending', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      Promise.all([thunk(dispatch)]).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.true;
      });
    });
    it('calls the api to save the form', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      Promise.all([thunk(dispatch)]).then(() => {
        expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
      });
    });
    it('dispatches a success if the form is saved', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true
      }));

      Promise.all([thunk(dispatch)]).then(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.success))).to.be.true;
      });
    });
    it('dispatches a no-auth if the api returns a 401', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.reset();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 401
      }));

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
      });
    });
    it('dispatches a failure on any other failure', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 404
      }));

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
      });
    });
    it('dispatches a failure when a network error occurs', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.reject(new Error('No network connection')));

      Promise.all([thunk(dispatch)]).then(() => {
        done(new Error("Should not call the dispatch's .then() on a network failure"));
      }).catch(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
        done();
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

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.noAuth))).to.be.true;
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.pending))).to.be.false;
      });
    });
    it('dispatches a pending', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      Promise.all([thunk(dispatch)]).then(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.pending))).to.be.true;
      }).catch(() => {}); // Swallow the error we don't care about for now
    });
    it('attempts to fetch an in-progress form', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      Promise.all([thunk(dispatch)]).then(() => {
        expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
      }).catch(() => {}); // Swallow the error we don't care about for now
    });
    it('dispatches a no-auth if the api returns a 401', () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: false,
        status: 401
      }));

      Promise.all([thunk(dispatch)]).catch(() => {
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

      Promise.all([thunk(dispatch)]).catch(() => {
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

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.notFound))).to.be.true;
      });
    });
    it("dispatches an invalid-data if the data returned from the api isn't an object", () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        json: () => ([]) // Return an empty object
      }));

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.invalidData))).to.be.true;
      });
    });
    it("dispatches an invalid-data if the api doesn't return valid json", () => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.resolve({
        ok: true,
        json: () => ([]) // Return an empty object
      }));

      Promise.all([thunk(dispatch)]).catch(() => {
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

      Promise.all([thunk(dispatch)]).catch(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.failure))).to.be.true;
      });
    });
    it('dispatches a failure on network error', (done) => {
      const thunk = fetchInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.reject(new Error('No network connection')));

      Promise.all([thunk(dispatch)]).then(() => {
        done(new Error("Should not call the dispatch's .then() on a network failure"));
      }).catch(() => {
        expect(dispatch.calledWith(setFetchFormStatus(LOAD_STATUSES.failure))).to.be.true;
        done();
      });
    });
  });
});
