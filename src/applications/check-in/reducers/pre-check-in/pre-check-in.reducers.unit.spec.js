import { expect } from 'chai';

import {
  recordAnswerHandler,
  setSessionHandler,
  setVeteranDataHandler,
} from './index';

import {
  createSetSession,
  recordAnswer,
  setVeteranData,
} from '../../actions/pre-check-in';

import { createInitFormAction } from '../../actions/navigation';

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
    describe('recordAnswer', () => {
      describe('recordAnswerHandler', () => {
        it('should return form structure', () => {
          const action = recordAnswer({ answer: 'yes' });
          const state = recordAnswerHandler({ form: {} }, action);
          expect(state).haveOwnProperty('form');
          expect(state.form).haveOwnProperty('data');
          expect(state.form.data).haveOwnProperty('answer');
        });
        it('should set session context data', () => {
          const action = recordAnswer({ answer: 'yes' });
          const state = recordAnswerHandler({ form: {} }, action);
          expect(state.form.data.answer).to.equal('yes');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        let state = {};
        beforeEach(() => {
          const action = createInitFormAction({
            pages: ['first-page', 'second-page', 'third-page'],
            currentPage: 'first-page',
          });
          state = appReducer.checkInData(undefined, action);
        });
        it('should record answer data', () => {
          const demoAction = recordAnswer({ demographicsUpToDate: 'yes' });
          state = appReducer.checkInData(undefined, demoAction);
          const nokAction = recordAnswer({ NextOfKinUpToDate: 'no' });
          state = appReducer.checkInData(state, nokAction);
          expect(state.form.data.demographicsUpToDate).to.equal('yes');
          expect(state.form.data.NextOfKinUpToDate).to.equal('no');
        });
        it('should update old answers', () => {
          const yesAction = recordAnswer({ demographicsUpToDate: 'yes' });
          state = appReducer.checkInData(undefined, yesAction);
          expect(state.form.data.demographicsUpToDate).to.equal('yes');
          const noAction = recordAnswer({ demographicsUpToDate: 'no' });
          state = appReducer.checkInData(state, noAction);
          expect(state.form.data.demographicsUpToDate).to.equal('no');
        });
      });
    });
    describe('setVeteranDataHandler', () => {
      describe('setVeteranData', () => {
        it('should return form structure', () => {
          const action = setVeteranData({
            appointments: [],
            demographics: {},
          });
          const state = setVeteranDataHandler({}, action);
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
          const state = setVeteranDataHandler({}, action);
          expect(state.veteranData.demographics).to.deep.equal({
            lastName: 'Smith',
          });
          expect(state.appointments).to.deep.equal([
            { appointmentIen: 'abc-123' },
            { appointmentIen: 'def-456' },
          ]);
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should return the correct state', () => {
          const action = setVeteranData({
            appointments: [
              { appointmentIen: 'abc-123' },
              {
                appointmentIen: 'def-456',
              },
            ],
            demographics: { lastName: 'Smith' },
          });
          const state = appReducer.checkInData(undefined, action);
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
});
