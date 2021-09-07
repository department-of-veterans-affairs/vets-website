import { expect } from 'chai';

import reducer from './index';

import { receivedAppointmentDetails, tokenWasValidated } from '../actions';

describe('check-in', () => {
  describe('reducer', () => {
    describe('receivedAppointmentDetails', () => {
      it('should create basic structure', () => {
        const action = receivedAppointmentDetails();
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('appointment');
        expect(state).haveOwnProperty('context');
        expect(state.context).haveOwnProperty('token');
      });
      it('should set token', () => {
        const action = receivedAppointmentDetails({}, 'token');
        const state = reducer.checkInData(undefined, action);
        expect(state.context.token).to.equal('token');
      });
      it('should set appointment', () => {
        const data = {
          startTime: '2021-08-19T13:56:31',
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
        };
        const action = receivedAppointmentDetails(data);
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('appointment');
        expect(state.appointment).haveOwnProperty('startTime');
        expect(state.appointment).haveOwnProperty('facility');
        expect(state.appointment).haveOwnProperty('clinicPhoneNumber');
        expect(state.appointment).haveOwnProperty('clinicFriendlyName');
        expect(state.appointment).haveOwnProperty('clinicName');
      });
    });
    describe('tokenWasValidated', () => {
      it('should create basic structure', () => {
        const action = tokenWasValidated({}, 'some-token', 'some-scope');
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('appointments');
        expect(state.appointments).to.be.an('array');
        expect(state).haveOwnProperty('context');
        expect(state.context).haveOwnProperty('token');
        expect(state.context).haveOwnProperty('scope');
      });
      it('should set context', () => {
        const action = tokenWasValidated({}, 'some-token', 'some-scope');
        const state = reducer.checkInData(undefined, action);
        expect(state.context).haveOwnProperty('token');
        expect(state.context.token).to.equal('some-token');
        expect(state.context).haveOwnProperty('scope');
        expect(state.context.scope).to.equal('some-scope');
      });
    });
  });
});
