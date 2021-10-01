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
        expect(action.data.appointments[0]).to.haveOwnProperty('id');
        expect(action.data.appointments[0].id).to.equal('some-id');
      });
    });
    describe('receivedAppointmentDetails', () => {
      it('should return correct action', () => {
        const action = receivedAppointmentDetails({ id: 'some-id' });
        expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
      });
      it('should return correct structure', () => {
        const action = receivedAppointmentDetails({ id: 'some-id' });
        expect(action.data.appointments[0]).to.haveOwnProperty('id');
        expect(action.data.appointments[0].id).to.equal('some-id');
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
        expect(action.data).to.haveOwnProperty('context');
        expect(action.data.context).to.haveOwnProperty('token');
        expect(action.data.context.token).to.equal('some-token');
        expect(action.data.context).to.haveOwnProperty('scope');
        expect(action.data.context.scope).to.equal('some-scope');
        expect(action.data).to.haveOwnProperty('appointments');
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
        expect(action.value).to.haveOwnProperty('permissions');
        expect(action.value.permissions).to.equal('some-permissions');
        expect(action.value).to.haveOwnProperty('scope');
        expect(action.value.scope).to.equal('some-scope');
      });
    });
    describe('appointmentWAsCheckedInto', () => {
      it('should return correct action', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIEN: 'some-ien',
        });
        expect(action.type).to.equal(APPOINTMENT_WAS_CHECKED_INTO);
      });
      it('should return correct structure', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIEN: 'some-ien',
        });
        expect(action.value).to.haveOwnProperty('appointment');
        expect(action.value.appointment.appointmentIEN).to.equal('some-ien');
      });
    });
  });
});
