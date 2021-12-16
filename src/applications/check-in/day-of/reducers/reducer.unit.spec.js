import { expect } from 'chai';

import reducer from './index';

import {
  appointmentWAsCheckedInto,
  receivedMultipleAppointmentDetails,
  receivedEmergencyContact,
  receivedDemographicsData,
  receivedNextOfKinData,
  tokenWasValidated,
  permissionsUpdated,
  triggerRefresh,
  seeStaffMessageUpdated,
  receivedDemographicsStatus,
} from '../actions';

describe('check-in', () => {
  describe('reducer', () => {
    describe('receivedEmergencyContact', () => {
      it('should create basic structure', () => {
        const action = receivedEmergencyContact({});
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('emergencyContact');
      });

      it('should set emergency contact information', () => {
        const data = {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        };
        const action = receivedEmergencyContact(data);
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('emergencyContact');
        expect(state.emergencyContact).to.be.an('object');
        expect(state.emergencyContact).haveOwnProperty('name');
        expect(state.emergencyContact).haveOwnProperty('relationship');
        expect(state.emergencyContact).haveOwnProperty('phone');
        expect(state.emergencyContact).haveOwnProperty('workPhone');
        expect(state.emergencyContact).haveOwnProperty('address');
      });
    });
    describe('receivedDemographicsData', () => {
      it('should create basic structure', () => {
        const action = receivedDemographicsData({});
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('demographics');
      });

      it('should set appointment', () => {
        const data = {
          mailingAddress: {
            address1: '123 Turtle Trail',
            city: 'Treetopper',
            state: 'Tennessee',
            zip: '101010',
          },
          homeAddress: {
            address1: '445 Fine Finch Fairway',
            address2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          homePhone: '5552223333',
          mobilePhone: '5553334444',
          workPhone: '5554445555',
          emailAddress: 'kermit.frog@sesameenterprises.us',
        };
        const action = receivedDemographicsData(data);
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('demographics');
        expect(state.demographics).to.be.an('object');

        expect(state.demographics).haveOwnProperty('mailingAddress');
        expect(state.demographics).haveOwnProperty('homeAddress');
        expect(state.demographics).haveOwnProperty('homePhone');
        expect(state.demographics).haveOwnProperty('mobilePhone');
        expect(state.demographics).haveOwnProperty('workPhone');
        expect(state.demographics).haveOwnProperty('emailAddress');
      });
    });
    describe('receivedNextOfKinData', () => {
      it('should create basic structure', () => {
        const action = receivedNextOfKinData({});
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('nextOfKin');
      });

      it('should have the correct fields', () => {
        const data = {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        };
        const action = receivedNextOfKinData(data);
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('nextOfKin');
        expect(state.nextOfKin).to.be.an('object');
        expect(state.nextOfKin).haveOwnProperty('name');
        expect(state.nextOfKin).haveOwnProperty('relationship');
        expect(state.nextOfKin).haveOwnProperty('phone');
        expect(state.nextOfKin).haveOwnProperty('workPhone');
        expect(state.nextOfKin).haveOwnProperty('address');
      });
    });
    it('should trigger refresh', () => {
      const data = [
        {
          startTime: '2021-08-19T13:56:31',
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
        },
      ];
      const action = receivedMultipleAppointmentDetails(data);
      const state = reducer.checkInData(undefined, action);
      expect(state.context).to.eql({});

      const refreshAction = triggerRefresh();
      const newState = reducer.checkInData(undefined, refreshAction);
      expect(newState.context).to.eql({ shouldRefresh: true });
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
    it('should update permissions', () => {
      const action = tokenWasValidated({}, 'some-token', 'some-scope');
      const state = reducer.checkInData(undefined, action);
      expect(state.context).haveOwnProperty('token');
      expect(state.context.token).to.equal('some-token');
      expect(state.context).haveOwnProperty('scope');
      expect(state.context.scope).to.equal('some-scope');
      const permissionsAction = permissionsUpdated({}, 'new-scope');
      const newState = reducer.checkInData(undefined, permissionsAction);
      expect(newState.context).haveOwnProperty('scope');
      expect(newState.context.scope).to.equal('new-scope');
    });
  });
  describe('appointmentWAsCheckedInto', () => {
    it('should create basic structure', () => {
      const action = appointmentWAsCheckedInto({
        appointmentIen: 'some-ien',
      });
      const state = reducer.checkInData(undefined, action);
      expect(state).haveOwnProperty('context');
      expect(state.context).haveOwnProperty('appointment');
    });
    it('should set context', () => {
      const action = appointmentWAsCheckedInto({
        appointmentIen: 'some-ien',
      });
      const state = reducer.checkInData(undefined, action);
      expect(state).haveOwnProperty('context');
      expect(state.context).haveOwnProperty('appointment');
      expect(state.context.appointment).haveOwnProperty('appointmentIen');
      expect(state.context.appointment.appointmentIen).to.equal('some-ien');
    });
  });
  describe('defaultAction', () => {
    it('the default action should be to return the state unchanged', () => {
      const action = receivedMultipleAppointmentDetails([]);
      const state = reducer.checkInData(undefined, action);
      expect(state).haveOwnProperty('appointments');
      const newState = reducer.checkInData(state, { type: 'none' });
      expect(newState).to.eql(state);
    });
    describe('seeStaffMessageUpdated', () => {
      it('the see staff message should get updates', () => {
        const action = seeStaffMessageUpdated('This is a message');
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('seeStaffMessage');
        expect(state.seeStaffMessage).to.equal('This is a message');
      });
    });

    describe('receivedDemographicsStatus', () => {
      it('should create basic structure', () => {
        const action = receivedDemographicsStatus({});
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('demographicsStatus');
      });

      it('should have the correct fields', () => {
        const data = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: null,
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: null,
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const action = receivedDemographicsStatus(data);
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('demographicsStatus');
        expect(state.demographicsStatus).to.be.an('object');
        expect(state.demographicsStatus).haveOwnProperty(
          'demographicsNeedsUpdate',
        );
        expect(state.demographicsStatus).haveOwnProperty(
          'demographicsConfirmedAt',
        );
        expect(state.demographicsStatus).haveOwnProperty(
          'nextOfKinNeedsUpdate',
        );
        expect(state.demographicsStatus).haveOwnProperty(
          'nextOfKinConfirmedAt',
        );
        expect(state.demographicsStatus).haveOwnProperty(
          'emergencyContactNeedsUpdate',
        );
        expect(state.demographicsStatus).haveOwnProperty(
          'emergencyContactConfirmedAt',
        );
      });
    });
  });
});
