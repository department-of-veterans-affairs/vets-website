import { expect } from 'chai';

import { setAppHandler } from './index';

import { setApp } from '../../actions/universal';

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
  });
});
