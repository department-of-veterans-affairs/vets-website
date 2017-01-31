import { expect } from 'chai';
import sinon from 'sinon';

import {
  setData,
  SET_DATA,
  setEditMode,
  SET_EDIT_MODE,
  setSubmission,
  SET_SUBMISSION,
  setPrivacyAgreement,
  SET_PRIVACY_AGREEMENT,
  setSubmitted,
  SET_SUBMITTED,
  submitForm
} from '../../../src/js/common/schemaform/actions';

describe('Schemaform actions:', () => {
  describe('setData', () => {
    it('should return action', () => {
      const page = 'page';
      const data = {};
      const action = setData(page, data);

      expect(action.page).to.equal(page);
      expect(action.data).to.equal(data);
      expect(action.type).to.equal(SET_DATA);
    });
  });
  describe('setEditMode', () => {
    it('should return action', () => {
      const page = 'page';
      const edit = false;
      const action = setEditMode(page, edit);

      expect(action.page).to.equal(page);
      expect(action.edit).to.equal(edit);
      expect(action.type).to.equal(SET_EDIT_MODE);
    });
  });
  describe('setSubmission', () => {
    it('should return action', () => {
      const field = 'page';
      const value = false;
      const action = setSubmission(field, value);

      expect(action.field).to.equal(field);
      expect(action.value).to.equal(value);
      expect(action.type).to.equal(SET_SUBMISSION);
    });
  });
  describe('setPrivacyAgreement', () => {
    it('should return action', () => {
      const accepted = false;
      const action = setPrivacyAgreement(accepted);

      expect(action.privacyAgreementAccepted).to.equal(accepted);
      expect(action.type).to.equal(SET_PRIVACY_AGREEMENT);
    });
  });
  describe('setSubmitted', () => {
    it('should return action', () => {
      const response = false;
      const action = setSubmitted(response);

      expect(action.response).to.equal(response);
      expect(action.type).to.equal(SET_SUBMITTED);
    });
  });
  describe('submitForm', () => {
    let fetchMock;
    let oldFetch;

    beforeEach(() => {
      oldFetch = global.fetch;
      fetchMock = sinon.stub();
      global.fetch = fetchMock;
      window.dataLayer = [];
    });

    afterEach(() => {
      global.fetch = oldFetch;
    });

    it('should set submitted', () => {
      const formConfig = {};
      const form = {
        testing: {
          data: {
            test: 1
          }
        }
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };
      fetchMock.returns({
        then: (fn) => fn(
          {
            ok: true,
            status: 200,
            json: () => Promise.resolve(response)
          }
        )
      });

      return thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending'
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMITTED,
          response: {}
        });
      });
    });
    it('should set submission error', () => {
      const formConfig = {};
      const form = {
        testing: {
          data: {
            test: 1
          }
        }
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };
      fetchMock.returns({
        then: (fn) => fn(
          {
            ok: false,
            status: 500,
            json: () => Promise.resolve(response)
          }
        )
      });

      return thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending'
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'error'
        });
      });
    });
  });
});
