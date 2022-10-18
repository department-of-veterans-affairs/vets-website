import { expect } from 'chai';

import { setAppHandler, setErrorHandler } from './index';

import { setApp, setError } from '../../actions/universal';

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
  });
});
