import { expect } from 'chai';

import { initFormHandler, updateFormHandler } from './index';
import {
  createInitFormAction,
  updateFormAction,
} from '../../actions/navigation';

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

    describe('updateFormAction', () => {
      describe('updateFormHandler', () => {
        it('should return the correct structure', () => {
          const action = updateFormAction({
            patientDemographicsStatus: {},
          });
          const state = updateFormHandler({}, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).haveOwnProperty('pages');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set form data', () => {
          const action = updateFormAction({
            patientDemographicsStatus: {},
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).haveOwnProperty('pages');
          expect(state.form.pages).to.deep.equal([
            'verify',
            'introduction',
            'contact-information',
            'emergency-contact',
            'next-of-kin',
            'complete',
          ]);
        });
      });
    });
  });
});
