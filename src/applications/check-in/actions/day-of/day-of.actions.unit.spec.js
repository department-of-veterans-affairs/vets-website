import { expect } from 'chai';

import {
  appointmentWasCheckedInto,
  APPOINTMENT_WAS_CHECKED_INTO,
  receivedMultipleAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
  tokenWasValidated,
  TOKEN_WAS_VALIDATED,
  permissionsUpdated,
  PERMISSIONS_UPDATED,
  receivedEmergencyContact,
  RECEIVED_EMERGENCY_CONTACT_DATA,
  receivedDemographicsData,
  RECEIVED_DEMOGRAPHICS_DATA,
  triggerRefresh,
  TRIGGER_REFRESH,
  receivedNextOfKinData,
  RECEIVED_NEXT_OF_KIN_DATA,
  SEE_STAFF_MESSAGE_UPDATED,
  seeStaffMessageUpdated,
} from './index';

describe('check in actions', () => {
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
    describe('appointmentWasCheckedInto', () => {
      it('should return correct action', () => {
        const action = appointmentWasCheckedInto({
          appointmentIen: 'some-ien',
        });
        expect(action.type).to.equal(APPOINTMENT_WAS_CHECKED_INTO);
      });
      it('should return correct structure', () => {
        const action = appointmentWasCheckedInto({
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
    describe('triggerRefresh', () => {
      it('should return correct action', () => {
        const action = triggerRefresh();
        expect(action.type).to.equal(TRIGGER_REFRESH);
      });
      it('should return correct structure', () => {
        const action = triggerRefresh();
        expect(action.payload.context.shouldRefresh).to.equal(true);
      });
    });
    describe('receivedNextOfKinData', () => {
      it('should return correct action', () => {
        const action = receivedNextOfKinData({});
        expect(action.type).to.equal(RECEIVED_NEXT_OF_KIN_DATA);
      });
      it('should return correct structure', () => {
        const action = receivedNextOfKinData({
          relationship: 'spouse',
        });
        expect(action.payload).to.haveOwnProperty('nextOfKin');
        expect(action.payload.nextOfKin.relationship).to.equal('spouse');
      });
    });
    describe('seeStaffMessageUpdated', () => {
      it('should return correct action', () => {
        const action = seeStaffMessageUpdated('test');
        expect(action.type).to.equal(SEE_STAFF_MESSAGE_UPDATED);
      });
      it('should return correct structure', () => {
        const action = seeStaffMessageUpdated('test');
        expect(action.payload.seeStaffMessage).to.equal('test');
      });
    });
    describe('receivedEmergencyContact', () => {
      it('should return correct action', () => {
        const action = receivedEmergencyContact({ name: 'Jimmy' });
        expect(action.type).to.equal(RECEIVED_EMERGENCY_CONTACT_DATA);
      });
      it('should return correct structure', () => {
        const action = receivedEmergencyContact({ name: 'Jimmy' });
        expect(action.payload).to.haveOwnProperty('emergencyContact');
        expect(action.payload.emergencyContact.name).to.equal('Jimmy');
      });
    });
  });
});
