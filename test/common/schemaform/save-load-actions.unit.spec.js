import { expect, assert } from 'chai';
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

    it('Dispatches a no-auth if the user has no session token', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      delete sessionStorage.userToken;

      thunk(dispatch);
      console.log(dispatch.args[0]);
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.false;
    });
    it('Dispatches a pending', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      thunk(dispatch);
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.pending))).to.be.true;
    });
    it('Call the api to save the form', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();

      thunk(dispatch);
      expect(global.fetch.args[0][0]).to.contain('/v0/in_progress_forms/hca');
    });
    it('Dispatches a success if the form is saved', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns({
        then: (fn) => fn({
          ok: true
        })
      });

      thunk(dispatch);
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.success))).to.be.true;
    });
    it('Dispatches a no-auth if the api returns a 401', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns({
        then: (fn) => fn({
          ok: false,
          status: 401
        })
      });

      thunk(dispatch);
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.noAuth))).to.be.true;
    });
    it('Dispatches a failure on any other failure', () => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns({
        then: (fn) => fn({
          ok: false,
          status: 404
        })
      });

      thunk(dispatch);
      expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
    });
    it.only('Dispatches a failure when a network error occurs', (done) => {
      const thunk = saveInProgressForm('hca', 0, 'some/path', {});
      const dispatch = sinon.spy();
      global.fetch.returns(Promise.reject(new Error('No network connection')));

      const p = thunk(dispatch);
      Promise.all([p]).then(() => {
        done(new Error("Should not call the dispatch's .then() on a network failure"));
      }).catch(() => {
        expect(dispatch.calledWith(setSaveFormStatus(SAVE_STATUSES.failure))).to.be.true;
        done();
      });
    });
  });
});
