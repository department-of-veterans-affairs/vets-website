import { expect } from 'chai';

import {
  appointmentWasCheckedIntoHandler,
  receivedDemographicsDataHandler,
  receivedAppointmentDetailsHandler,
  seeStaffMessageUpdatedHandler,
  triggerRefreshHandler,
} from './index';

import { updateFormHandler } from '../navigation';

import {
  appointmentWasCheckedInto,
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  seeStaffMessageUpdated,
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

    describe('receivedDemographicsData', () => {
      describe('receivedDemographicsDataHandler', () => {
        it('should create basic structure', () => {
          const action = receivedDemographicsData({});
          const state = receivedDemographicsDataHandler({}, action);
          expect(state).haveOwnProperty('veteranData');
        });
        it('should set demographics', () => {
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
          expect(state).haveOwnProperty('veteranData');
          expect(state.veteranData).to.be.an('object');

          expect(state.veteranData.demographics).haveOwnProperty(
            'mailingAddress',
          );
          expect(state.veteranData.demographics).haveOwnProperty('homeAddress');
          expect(state.veteranData.demographics).haveOwnProperty('homePhone');
          expect(state.veteranData.demographics).haveOwnProperty('mobilePhone');
          expect(state.veteranData.demographics).haveOwnProperty('workPhone');
          expect(state.veteranData.demographics).haveOwnProperty(
            'emailAddress',
          );
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
          expect(state).haveOwnProperty('veteranData');
          expect(state.veteranData).to.be.an('object');

          expect(state.veteranData.demographics).haveOwnProperty(
            'mailingAddress',
          );
          expect(state.veteranData.demographics).haveOwnProperty('homeAddress');
          expect(state.veteranData.demographics).haveOwnProperty('homePhone');
          expect(state.veteranData.demographics).haveOwnProperty('mobilePhone');
          expect(state.veteranData.demographics).haveOwnProperty('workPhone');
          expect(state.veteranData.demographics).haveOwnProperty(
            'emailAddress',
          );
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
