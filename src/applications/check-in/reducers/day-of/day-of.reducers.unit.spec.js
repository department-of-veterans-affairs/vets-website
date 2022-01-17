import { expect } from 'chai';

import {
  appointmentWasCheckedIntoHandler,
  permissionsUpdatedHandler,
  receivedDemographicsDataHandler,
  receivedEmergencyContactDataHandler,
  receivedAppointmentDetailsHandler,
  receivedNextOfKinDataHandler,
  seeStaffMessageUpdatedHandler,
  setTokenContextHandler,
  tokenWasValidatedHandler,
  triggerRefreshHandler,
} from './index';

import { updateFormHandler } from '../navigation';

import {
  appointmentWasCheckedInto,
  permissionsUpdated,
  receivedDemographicsData,
  receivedEmergencyContact,
  receivedMultipleAppointmentDetails,
  receivedNextOfKinData,
  seeStaffMessageUpdated,
  setTokenContext,
  tokenWasValidated,
  triggerRefresh,
  updateFormAction,
} from '../../actions/day-of';

import appReducer from '../index';

describe('check in', () => {
  describe('day of reducers', () => {
    describe('appointmentWasCheckedInto', () => {
      describe('appointmentWasCheckedIntoHandler', () => {
        it('should create basic structure', () => {
          const action = appointmentWasCheckedInto({
            appointmentIen: 'some-ien',
          });
          const state = appointmentWasCheckedIntoHandler({}, action);
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('appointment');
        });
        it('should set context', () => {
          const action = appointmentWasCheckedInto({
            appointmentIen: 'some-ien',
          });
          const state = appointmentWasCheckedIntoHandler({}, action);
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('appointment');
          expect(state.context.appointment).haveOwnProperty('appointmentIen');
          expect(state.context.appointment.appointmentIen).to.equal('some-ien');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should creat the correct structure', () => {
          const action = appointmentWasCheckedInto({
            appointmentIen: 'some-ien',
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('appointment');
          expect(state.context.appointment).haveOwnProperty('appointmentIen');
          expect(state.context.appointment.appointmentIen).to.equal('some-ien');
        });
      });
    });
    describe('permissionsUpdated', () => {
      describe('permissionsUpdatedHandler', () => {
        it('should create basic structure', () => {
          const permissionsAction = permissionsUpdated({}, 'new-scope');
          const newState = permissionsUpdatedHandler({}, permissionsAction);
          expect(newState.context).haveOwnProperty('scope');
        });
        it('should set the correct values', () => {
          const permissionsAction = permissionsUpdated({}, 'new-scope');
          const newState = permissionsUpdatedHandler({}, permissionsAction);
          expect(newState.context.scope).to.equal('new-scope');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        const permissionsAction = permissionsUpdated({}, 'new-scope');
        const newState = appReducer.checkInData(undefined, permissionsAction);
        expect(newState.context.scope).to.equal('new-scope');
      });
    });
    describe('receivedDemographicsData', () => {
      describe('receivedDemographicsDataHandler', () => {
        it('should create basic structure', () => {
          const action = receivedDemographicsData({});
          const state = receivedDemographicsDataHandler({}, action);
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
          const state = receivedDemographicsDataHandler({}, action);
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
      describe('reducer is called; finds the correct handler', () => {
        it('finds the correct handler', () => {
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
          const state = appReducer.checkInData(undefined, action);
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
    });
    describe('receivedEmergencyContact', () => {
      describe('receivedEmergencyContactDataHandler', () => {
        it('should create basic structure', () => {
          const action = receivedEmergencyContact({});
          const state = receivedEmergencyContactDataHandler({}, action);
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
          const state = receivedEmergencyContactDataHandler({}, action);
          expect(state).haveOwnProperty('emergencyContact');
          expect(state.emergencyContact).to.be.an('object');
          expect(state.emergencyContact).haveOwnProperty('name');
          expect(state.emergencyContact).haveOwnProperty('relationship');
          expect(state.emergencyContact).haveOwnProperty('phone');
          expect(state.emergencyContact).haveOwnProperty('workPhone');
          expect(state.emergencyContact).haveOwnProperty('address');
        });
      });
      describe('reducer is called; ', () => {
        it('finds the correct handler', () => {
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
          const state = appReducer.checkInData(undefined, action);
          expect(state).haveOwnProperty('emergencyContact');
          expect(state.emergencyContact).to.be.an('object');
          expect(state.emergencyContact).haveOwnProperty('name');
          expect(state.emergencyContact).haveOwnProperty('relationship');
          expect(state.emergencyContact).haveOwnProperty('phone');
          expect(state.emergencyContact).haveOwnProperty('workPhone');
          expect(state.emergencyContact).haveOwnProperty('address');
        });
      });
    });
    describe('receivedMultipleAppointmentDetails', () => {
      describe('receivedAppointmentDetailsHandler', () => {
        it('should create basic structure', () => {
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
          const state = receivedAppointmentDetailsHandler({}, action);
          expect(state.appointments).to.be.an('array');
        });
        it('should set the correct values', () => {
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
          const state = receivedAppointmentDetailsHandler({}, action);
          expect(state.appointments[0].startTime).to.equal(
            '2021-08-19T13:56:31',
          );
          expect(state.appointments[0].facility).to.equal(
            'LOMA LINDA VA CLINIC',
          );
          expect(state.appointments[0].clinicPhoneNumber).to.equal(
            '5551234567',
          );
          expect(state.appointments[0].clinicFriendlyName).to.equal(
            'TEST CLINIC',
          );
        });
      });
      describe('reducer is called;', () => {
        it('finds the correct handler', () => {
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
          const state = appReducer.checkInData(undefined, action);
          expect(state.appointments[0].startTime).to.equal(
            '2021-08-19T13:56:31',
          );
          expect(state.appointments[0].facility).to.equal(
            'LOMA LINDA VA CLINIC',
          );
          expect(state.appointments[0].clinicPhoneNumber).to.equal(
            '5551234567',
          );
          expect(state.appointments[0].clinicFriendlyName).to.equal(
            'TEST CLINIC',
          );
        });
      });
    });
    describe('receivedNextOfKinData', () => {
      describe('receivedNextOfKinDataHandler', () => {
        it('should create basic structure', () => {
          const action = receivedNextOfKinData({});
          const state = receivedNextOfKinDataHandler({}, action);
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
          const state = receivedNextOfKinDataHandler({}, action);
          expect(state).haveOwnProperty('nextOfKin');
          expect(state.nextOfKin).to.be.an('object');
          expect(state.nextOfKin).haveOwnProperty('name');
          expect(state.nextOfKin).haveOwnProperty('relationship');
          expect(state.nextOfKin).haveOwnProperty('phone');
          expect(state.nextOfKin).haveOwnProperty('workPhone');
          expect(state.nextOfKin).haveOwnProperty('address');
        });
      });
      describe('reducer is called;', () => {
        it('find the correct handler', () => {
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
            const state = appReducer.checkInData(undefined, action);
            expect(state).haveOwnProperty('nextOfKin');
            expect(state.nextOfKin).to.be.an('object');
            expect(state.nextOfKin).haveOwnProperty('name');
            expect(state.nextOfKin).haveOwnProperty('relationship');
            expect(state.nextOfKin).haveOwnProperty('phone');
            expect(state.nextOfKin).haveOwnProperty('workPhone');
            expect(state.nextOfKin).haveOwnProperty('address');
          });
        });
      });
    });
    describe('seeStaffMessageUpdated', () => {
      describe('seeStaffMessageUpdatedHandler', () => {
        it('should create basic structure', () => {
          const action = seeStaffMessageUpdated('This is a message');
          const state = seeStaffMessageUpdatedHandler({}, action);
          expect(state).haveOwnProperty('seeStaffMessage');
        });
        it('should set the correct values', () => {
          const action = seeStaffMessageUpdated('This is a message');
          const state = seeStaffMessageUpdatedHandler({}, action);
          expect(state.seeStaffMessage).to.equal('This is a message');
        });
      });
      describe('reducer is called; ', () => {
        it('finds the correct handler', () => {
          const action = seeStaffMessageUpdated('This is a message');
          const state = appReducer.checkInData(undefined, action);
          expect(state.seeStaffMessage).to.equal('This is a message');
        });
      });
    });
    describe('setTokenContext', () => {
      describe('setTokenContextHandler', () => {
        it('should create basic structure', () => {
          const action = setTokenContext('some-token', 'some-scope');
          const state = setTokenContextHandler({}, action);
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('token');
          expect(state.context).haveOwnProperty('scope');
        });
        it('should set the correct values', () => {
          const action = setTokenContext('some-token', 'some-scope');
          const state = setTokenContextHandler({}, action);
          expect(state).haveOwnProperty('context');
          expect(state.context.token).to.equal('some-token');
          expect(state.context.scope).to.equal('some-scope');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('finds the correct handler', () => {
          const action = setTokenContext('some-token', 'some-scope');
          const state = appReducer.checkInData(undefined, action);
          expect(state).haveOwnProperty('context');
          expect(state.context.token).to.equal('some-token');
          expect(state.context.scope).to.equal('some-scope');
        });
      });
    });
    describe('tokenWasValidated', () => {
      describe('tokenWasValidatedHandler', () => {
        it('should create basic structure', () => {
          const action = tokenWasValidated({}, 'some-token', 'some-scope');
          const state = tokenWasValidatedHandler({}, action);
          expect(state).haveOwnProperty('appointments');
          expect(state.appointments).to.be.an('array');
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('token');
          expect(state.context).haveOwnProperty('scope');
        });
        it('should set context', () => {
          const action = tokenWasValidated({}, 'some-token', 'some-scope');
          const state = tokenWasValidatedHandler({}, action);
          expect(state.context).haveOwnProperty('token');
          expect(state.context.token).to.equal('some-token');
          expect(state.context).haveOwnProperty('scope');
          expect(state.context.scope).to.equal('some-scope');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('finds the correct handler', () => {
          const action = tokenWasValidated({}, 'some-token', 'some-scope');
          const state = appReducer.checkInData({}, action);
          expect(state.context).haveOwnProperty('token');
          expect(state.context.token).to.equal('some-token');
          expect(state.context).haveOwnProperty('scope');
          expect(state.context.scope).to.equal('some-scope');
        });
      });
    });
    describe('triggerRefresh', () => {
      describe('triggerRefreshHandler', () => {
        it('should create basic structure', () => {
          const action = triggerRefresh(true);
          const state = triggerRefreshHandler({}, action);
          expect(state).haveOwnProperty('context');
          expect(state.context).haveOwnProperty('shouldRefresh');
        });
        it('should set the correct values', () => {
          const action = triggerRefresh(true);
          const state = triggerRefreshHandler({}, action);
          expect(state.context.shouldRefresh).to.equal(true);
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('finds the correct handler', () => {
          const action = triggerRefresh(true);
          const state = appReducer.checkInData(undefined, action);
          expect(state.context.shouldRefresh).to.equal(true);
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
            'loading-appointments',
            'contact-information',
            'emergency-contact',
            'next-of-kin',
            'details',
            'complete',
          ]);
        });
      });
    });
  });
});
