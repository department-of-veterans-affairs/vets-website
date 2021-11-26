import { expect } from 'chai';

import reducer from './index';

import {
  createInitFormAction,
  createGoToNextPageAction,
  createSetSession,
  recordAnswer,
} from '../actions';

// test init stat

describe('check-in', () => {
  describe('reducer', () => {
    describe('initial state and default actions', () => {
      it('should return the init state with no action', () => {
        const state = reducer.preCheckInData(undefined, {});
        expect(state).to.deep.equal({
          appointments: [],
          veteranData: {
            demographics: {},
          },
          context: {},
          form: {
            pages: [],
            currentPage: '',
            data: {},
          },
        });
      });
    });
    describe('createInitFormAction', () => {
      it('should return form structure', () => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page', 'third-page'],
          currentPage: 'first-page',
        });
        const state = reducer.preCheckInData(undefined, action);
        expect(state).haveOwnProperty('form');
        expect(state.form).haveOwnProperty('pages');
        expect(state.form).haveOwnProperty('currentPage');
      });

      it('should set form data', () => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page', 'third-page'],
          firstPage: 'first-page',
        });
        const state = reducer.preCheckInData(undefined, action);
        expect(state.form.data).to.deep.equal({});
        expect(state.form.pages).to.deep.equal([
          'first-page',
          'second-page',
          'third-page',
        ]);
        expect(state.form.currentPage).to.equal('first-page');
      });
    });
    describe('createGoToNextPageAction', () => {
      let state = {};
      beforeEach(() => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page', 'third-page'],
          currentPage: 'first-page',
        });
        state = reducer.preCheckInData(undefined, action);
      });
      it('should return form structure', () => {
        const action = createGoToNextPageAction({
          nextPage: 'second-page',
        });
        state = reducer.preCheckInData(undefined, action);
        expect(state.form).haveOwnProperty('currentPage');
      });

      it('should set form data', () => {
        const action = createGoToNextPageAction({
          nextPage: 'second-page',
        });
        state = reducer.preCheckInData(undefined, action);
        expect(state.form.currentPage).to.equal('second-page');
      });
    });
    describe('createSetSession', () => {
      it('should return form structure', () => {
        const action = createSetSession({
          token: 'some-token',
          permissions: 'some-permission',
        });
        const state = reducer.preCheckInData(undefined, action);
        expect(state.context).haveOwnProperty('token');
        expect(state.context).haveOwnProperty('permissions');
      });

      it('should set session context data', () => {
        const action = createSetSession({
          token: 'some-token',
          permissions: 'some-permission',
        });
        const state = reducer.preCheckInData(undefined, action);
        expect(state.context.token).to.equal('some-token');
        expect(state.context.permissions).to.equal('some-permission');
      });
    });
    describe('recordAnswer', () => {
      let state = {};
      beforeEach(() => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page', 'third-page'],
          currentPage: 'first-page',
        });
        state = reducer.preCheckInData(undefined, action);
      });
      it('should record answer data', () => {
        const demoAction = recordAnswer({ demographicsUpToDate: 'yes' });
        state = reducer.preCheckInData(undefined, demoAction);
        const nokAction = recordAnswer({ NextOfKinUpToDate: 'no' });
        state = reducer.preCheckInData(state, nokAction);
        expect(state.form.data.demographicsUpToDate).to.equal('yes');
        expect(state.form.data.NextOfKinUpToDate).to.equal('no');
      });
      it('should update old answers', () => {
        const yesAction = recordAnswer({ demographicsUpToDate: 'yes' });
        state = reducer.preCheckInData(undefined, yesAction);
        expect(state.form.data.demographicsUpToDate).to.equal('yes');
        const noAction = recordAnswer({ demographicsUpToDate: 'no' });
        state = reducer.preCheckInData(state, noAction);
        expect(state.form.data.demographicsUpToDate).to.equal('no');
      });
    });
  });
});
