import { expect } from 'chai';

import { gotToNextPageHandler, initFormHandler } from './index';
import {
  createInitFormAction,
  createGoToNextPageAction,
} from '../../actions/navigation';

import appReducer from '../index';

describe('check in', () => {
  describe('navigation reducers', () => {
    describe('createInitFormAction', () => {
      describe('initFormHandler', () => {
        it('should return the correct structure', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
            firstPage: 'first-page',
          });
          const state = initFormHandler({}, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).haveOwnProperty('pages');
          expect(state.form).haveOwnProperty('currentPage');
        });
        it('should set form data', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
            firstPage: 'first-page',
          });
          const state = initFormHandler({}, action);
          expect(state.form.pages).to.deep.equal([
            'first-page',
            'second-page',
            'third-page',
          ]);
          expect(state.form.currentPage).to.equal('first-page');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set form data', () => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
            firstPage: 'first-page',
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state.form.data).to.deep.equal({});
          expect(state.form.pages).to.deep.equal([
            'first-page',
            'second-page',
            'third-page',
          ]);
          expect(state.form.currentPage).to.equal('first-page');
        });
      });
    });
    describe('createGoToNextPageAction', () => {
      describe('gotToNextPageHandler', () => {
        it('should return the correct structure', () => {
          const action = createGoToNextPageAction({
            nextPage: 'second-page',
          });
          const state = gotToNextPageHandler({}, action);
          expect(state.form).haveOwnProperty('currentPage');
        });
        it('should set the data', () => {
          const action = createGoToNextPageAction({
            nextPage: 'second-page',
          });
          const state = gotToNextPageHandler({}, action);
          expect(state.form.currentPage).to.equal('second-page');
        });
      });
      describe('reducer is called;', () => {
        it('should set form data', () => {
          const action = createGoToNextPageAction({
            nextPage: 'second-page',
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state.form.currentPage).to.equal('second-page');
        });
      });
    });
  });
});
