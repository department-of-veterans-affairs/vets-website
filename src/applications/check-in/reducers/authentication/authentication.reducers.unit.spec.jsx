import { expect } from 'chai';

import { setSessionHandler } from './index';

import { createSetSession } from '../../actions/authentication';

import appReducer from '../index';

describe('check in', () => {
  describe('pre-check-in reducers', () => {
    describe('createSetSession', () => {
      describe('setSessionHandler', () => {
        it('should return form structure', () => {
          const action = createSetSession({
            token: 'some-token',
            permissions: 'some-permission',
          });
          const state = setSessionHandler({}, action);
          expect(state.context).haveOwnProperty('token');
          expect(state.context).haveOwnProperty('permissions');
        });

        it('should set session context data', () => {
          const action = createSetSession({
            token: 'some-token',
            permissions: 'some-permission',
          });
          const state = setSessionHandler({}, action);
          expect(state.context.token).to.equal('some-token');
          expect(state.context.permissions).to.equal('some-permission');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set correct data', () => {
          const action = createSetSession({
            token: 'some-token',
            permissions: 'some-permission',
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state.context.token).to.equal('some-token');
          expect(state.context.permissions).to.equal('some-permission');
        });
      });
    });
  });
});
