import { expect } from 'chai';

import { setAppHandler, setErrorHandler, setFormHandler } from './index';

import { setApp, setError, setForm } from '../../actions/universal';

import appReducer from '../index';

describe('check in', () => {
  describe('universal reducers', () => {
    describe('setApp', () => {
      describe('setAppHandler', () => {
        it('should return form structure', () => {
          const action = setApp('');
          const state = setAppHandler({ app: '' }, action);
          expect(state).haveOwnProperty('app');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set the app name', () => {
          let state = {};
          const action = setApp('preCheckIn');
          state = appReducer.checkInData(undefined, action);
          expect(state.app).to.equal('preCheckIn');
        });
      });
    });
    describe('setError', () => {
      describe('setErrorHandler', () => {
        it('should return form structure', () => {
          const action = setError('');
          const state = setErrorHandler({ error: '' }, action);
          expect(state).haveOwnProperty('error');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set the error string', () => {
          let state = {};
          const action = setError('max-validation');
          state = appReducer.checkInData(undefined, action);
          expect(state.error).to.equal('max-validation');
        });
      });
    });
    describe('setForm', () => {
      describe('setFormHandler', () => {
        it('should return form structure', () => {
          const action = setForm('');
          const state = setFormHandler({ form: '' }, action);
          expect(state).haveOwnProperty('form');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set the form object', () => {
          let state = {};
          const form = {
            pages: ['verify', 'contact-information', 'emergency-contact'],
            data: {
              demographicsUpToDate: 'yes',
            },
          };
          const action = setForm(form);
          state = appReducer.checkInData(undefined, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).to.be.an('object');
          expect(state.form).haveOwnProperty('pages');
          expect(state.form).haveOwnProperty('data');
          expect(state.form.data).haveOwnProperty('demographicsUpToDate');
          expect(state.form.data.demographicsUpToDate).to.equal('yes');
        });
      });
    });
  });
});
