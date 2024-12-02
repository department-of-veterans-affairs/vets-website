import { expect } from 'chai';

import { initFormHandler } from './index';
import { createInitFormAction } from '../../actions/navigation';

import appReducer from '../index';

describe('check in', () => {
  describe('navigation reducers', () => {
    describe('createInitFormAction', () => {
      describe('initFormHandler', () => {
        it('should return the correct structure', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
          });
          const state = initFormHandler({}, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).haveOwnProperty('pages');
        });
        it('should set form data', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
          });
          const state = initFormHandler({}, action);
          expect(state.form.pages).to.deep.equal([
            'first-page',
            'second-page',
            'third-page',
          ]);
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set form data', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state.form.data).to.deep.equal({});
          expect(state.form.pages).to.deep.equal([
            'first-page',
            'second-page',
            'third-page',
          ]);
        });
      });
    });
  });
});
