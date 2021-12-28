import { expect } from 'chai';

import reducer from './index';

import { createSetSession, recordAnswer, setVeteranData } from '../actions';

import { createInitFormAction, createGoToNextPageAction } from '../../actions';
// test init stat

describe('check-in', () => {
  describe('reducer', () => {
    describe('initial state and default actions', () => {
      it('should return the init state with no action', () => {
        const state = reducer.checkInData(undefined, {});
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
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('form');
        expect(state.form).haveOwnProperty('pages');
        expect(state.form).haveOwnProperty('currentPage');
      });

      it('should set form data', () => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page', 'third-page'],
          firstPage: 'first-page',
        });
        const state = reducer.checkInData(undefined, action);
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
        state = reducer.checkInData(undefined, action);
      });
      it('should return form structure', () => {
        const action = createGoToNextPageAction({
          nextPage: 'second-page',
        });
        state = reducer.checkInData(undefined, action);
        expect(state.form).haveOwnProperty('currentPage');
      });

      it('should set form data', () => {
        const action = createGoToNextPageAction({
          nextPage: 'second-page',
        });
        state = reducer.checkInData(undefined, action);
        expect(state.form.currentPage).to.equal('second-page');
      });
    });
    describe('createSetSession', () => {
      it('should return form structure', () => {
        const action = createSetSession({
          token: 'some-token',
          permissions: 'some-permission',
        });
        const state = reducer.checkInData(undefined, action);
        expect(state.context).haveOwnProperty('token');
        expect(state.context).haveOwnProperty('permissions');
      });

      it('should set session context data', () => {
        const action = createSetSession({
          token: 'some-token',
          permissions: 'some-permission',
        });
        const state = reducer.checkInData(undefined, action);
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
        state = reducer.checkInData(undefined, action);
      });
      it('should record answer data', () => {
        const demoAction = recordAnswer({ demographicsUpToDate: 'yes' });
        state = reducer.checkInData(undefined, demoAction);
        const nokAction = recordAnswer({ NextOfKinUpToDate: 'no' });
        state = reducer.checkInData(state, nokAction);
        expect(state.form.data.demographicsUpToDate).to.equal('yes');
        expect(state.form.data.NextOfKinUpToDate).to.equal('no');
      });
      it('should update old answers', () => {
        const yesAction = recordAnswer({ demographicsUpToDate: 'yes' });
        state = reducer.checkInData(undefined, yesAction);
        expect(state.form.data.demographicsUpToDate).to.equal('yes');
        const noAction = recordAnswer({ demographicsUpToDate: 'no' });
        state = reducer.checkInData(state, noAction);
        expect(state.form.data.demographicsUpToDate).to.equal('no');
      });
    });
    describe('setVeteranData', () => {
      it('should return form structure', () => {
        const action = setVeteranData({
          appointments: [],
          demographics: {},
        });
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('veteranData');
        expect(state.veteranData).haveOwnProperty('demographics');
        expect(state).haveOwnProperty('appointments');
      });

      it('should set form data', () => {
        const action = setVeteranData({
          appointments: [
            { appointmentIen: 'abc-123' },
            {
              appointmentIen: 'def-456',
            },
          ],
          demographics: { lastName: 'Smith' },
        });
        const state = reducer.checkInData(undefined, action);
        expect(state.veteranData.demographics).to.deep.equal({
          lastName: 'Smith',
        });
        expect(state.appointments).to.deep.equal([
          { appointmentIen: 'abc-123' },
          { appointmentIen: 'def-456' },
        ]);
      });
    });
  });
});
