import { expect } from 'chai';

import reducer from './index';

import {
  receivedAppointmentDetails,
  receivedDemographicsData,
  tokenWasValidated,
  appointmentWAsCheckedInto,
} from '../actions';

describe('check-in', () => {
  describe('reducer', () => {
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
    describe('receivedAppointmentDetails', () => {
      it('should create basic structure', () => {
        const action = receivedAppointmentDetails();
        const state = reducer.checkInData(undefined, action);
        expect(state).haveOwnProperty('appointments');
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
        expect(state).haveOwnProperty('appointments');
        expect(state.appointments).to.be.an('array');

        expect(state.appointments[0]).haveOwnProperty('startTime');
        expect(state.appointments[0]).haveOwnProperty('facility');
        expect(state.appointments[0]).haveOwnProperty('clinicPhoneNumber');
        expect(state.appointments[0]).haveOwnProperty('clinicFriendlyName');
        expect(state.appointments[0]).haveOwnProperty('clinicName');
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
  });
});
