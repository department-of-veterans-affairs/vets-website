import { expect } from 'chai';

import {
  appointmentWAsCheckedInto,
  APPOINTMENT_WAS_CHECKED_INTO,
  receivedMultipleAppointmentDetails,
  receivedAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
  tokenWasValidated,
  TOKEN_WAS_VALIDATED,
  permissionsUpdated,
  PERMISSIONS_UPDATED,
  receivedDemographicsData,
  RECEIVED_DEMOGRAPHICS_DATA,
} from './index';

describe('check inactions', () => {
  describe('actions', () => {
    describe('receivedMultipleAppointmentDetails', () => {
      it('should return correct action', () => {
        const action = receivedMultipleAppointmentDetails([]);
        expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
      });
      it('should return correct structure', () => {
        const action = receivedMultipleAppointmentDetails([{ id: 'some-id' }]);
        expect(action.payload.appointments[0]).to.haveOwnProperty('id');
        expect(action.payload.appointments[0].id).to.equal('some-id');
      });
    });
    describe('receivedAppointmentDetails', () => {
      it('should return correct action', () => {
        const action = receivedAppointmentDetails({ id: 'some-id' });
        expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
      });
      it('should return correct structure', () => {
        const action = receivedAppointmentDetails({ id: 'some-id' });
        expect(action.payload.appointments[0]).to.haveOwnProperty('id');
        expect(action.payload.appointments[0].id).to.equal('some-id');
      });
    });
    describe('tokenWasValidated', () => {
      it('should return correct action', () => {
        const action = tokenWasValidated();
        expect(action.type).to.equal(TOKEN_WAS_VALIDATED);
      });
      it('should return correct structure', () => {
        const data = {};
        const token = 'some-token';
        const scope = 'some-scope';
        const action = tokenWasValidated(data, token, scope);
        expect(action.payload).to.haveOwnProperty('context');
        expect(action.payload.context).to.haveOwnProperty('token');
        expect(action.payload.context.token).to.equal('some-token');
        expect(action.payload.context).to.haveOwnProperty('scope');
        expect(action.payload.context.scope).to.equal('some-scope');
        expect(action.payload).to.haveOwnProperty('appointments');
      });
    });
    describe('permissionsUpdated', () => {
      it('should return correct action', () => {
        const action = permissionsUpdated({}, '');
        expect(action.type).to.equal(PERMISSIONS_UPDATED);
      });
      it('should return correct structure', () => {
        const action = permissionsUpdated(
          { permissions: 'some-permissions' },
          'some-scope',
        );
        expect(action.payload).to.haveOwnProperty('permissions');
        expect(action.payload.permissions).to.equal('some-permissions');
        expect(action.payload).to.haveOwnProperty('scope');
        expect(action.payload.scope).to.equal('some-scope');
      });
    });
    describe('appointmentWAsCheckedInto', () => {
      it('should return correct action', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIen: 'some-ien',
        });
        expect(action.type).to.equal(APPOINTMENT_WAS_CHECKED_INTO);
      });
      it('should return correct structure', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIen: 'some-ien',
        });
        expect(action.payload).to.haveOwnProperty('appointment');
        expect(action.payload.appointment.appointmentIen).to.equal('some-ien');
      });
    });
    describe('receivedDemographicsData', () => {
      it('should return correct action', () => {
        const action = receivedDemographicsData({});
        expect(action.type).to.equal(RECEIVED_DEMOGRAPHICS_DATA);
      });
      it('should return correct structure', () => {
        const action = receivedDemographicsData({
          homePhone: '555-867-5309',
        });
        expect(action.payload).to.haveOwnProperty('demographics');
        expect(action.payload.demographics.homePhone).to.equal('555-867-5309');
      });
    });
  });
});
