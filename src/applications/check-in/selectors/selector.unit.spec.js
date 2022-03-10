import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';

import {
  makeSelectCurrentContext,
  makeSelectEditContext,
  makeSelectForm,
  makeSelectVeteranData,
  makeSelectConfirmationData,
  makeSelectSeeStaffMessage,
  makeSelectApp,
  makeSelectPendingEdits,
} from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectEditContext', () => {
      const state = {
        checkInData: {
          context: {
            editing: {
              originatingUrl: 'contact-information',
              editingPage: 'demographics',
              value: 'kermit.frog@sesameenterprises.us',
              key: 'emailAddress',
            },
          },
        },
      };
      it('returns the correct structure from state', () => {
        const selectEditContext = makeSelectEditContext();
        expect(selectEditContext(state)).to.eql({
          editing: {
            originatingUrl: 'contact-information',
            editingPage: 'demographics',
            value: 'kermit.frog@sesameenterprises.us',
            key: 'emailAddress',
          },
        });
      });
    });
    describe('makeSelectForm', () => {
      const state = {
        checkInData: {
          form: {
            pages: [],
          },
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectForm();
        expect(selectFeatureToggles(state)).to.eql({
          pages: [],
        });
      });
    });
    describe('makeSelectCurrentContext', () => {
      const state = {
        checkInData: {
          context: {
            token: 'some-token',
            permissions: 'some-permissions',
          },
        },
      };
      it('returns feature toggles', () => {
        const selectCurrentContext = makeSelectCurrentContext();
        expect(selectCurrentContext(state)).to.eql({
          token: 'some-token',
          permissions: 'some-permissions',
        });
      });
    });
    describe('makeSelectVeteranData', () => {
      const state = {
        checkInData: {
          veteranData: {
            demographics: {
              firstName: 'first',
            },
          },
          appointments: [
            {
              appointmentIen: 'some-appointment-ien',
            },
            {
              appointmentIen: 'some-appointment-ien-2',
            },
          ],
        },
      };
      it('returns appointment and demographics data', () => {
        const selectVeteranData = makeSelectVeteranData();
        expect(selectVeteranData(state)).to.eql({
          demographics: {
            firstName: 'first',
          },
          appointments: [
            {
              appointmentIen: 'some-appointment-ien',
            },
            {
              appointmentIen: 'some-appointment-ien-2',
            },
          ],
        });
      });
    });
    describe('makeSelectConfirmationData', () => {
      const state = {
        checkInData: {
          appointments: [
            {
              clinicPhone: '555-867-5309',
              startTime: '2021-07-19T13:56:31',
              facilityName: 'Acme VA',
              clinicName: 'Green Team Clinic1',
            },
          ],
          context: {
            appointment: {
              appointmentIen: 'some-ien',
            },
            token: 'foo',
          },
        },
      };
      it('returns appointment confirmation data', () => {
        const selectConfirmationData = makeSelectConfirmationData();
        expect(selectConfirmationData(state)).to.eql({
          appointments: [
            {
              clinicName: 'Green Team Clinic1',
              clinicPhone: '555-867-5309',
              facilityName: 'Acme VA',
              startTime: '2021-07-19T13:56:31',
            },
          ],
          selectedAppointment: {
            appointmentIen: 'some-ien',
          },
        });
      });
      it('returns empty when appointment data is not available', () => {
        const partialState = cloneDeep(state);
        delete partialState.checkInData.appointments;
        delete partialState.checkInData.context.appointment;
        const selectConfirmationData = makeSelectConfirmationData();
        expect(selectConfirmationData(partialState)).to.eql({});
      });
    });
    describe('makeSelectSeeStaffMessage', () => {
      const state = {
        checkInData: {
          seeStaffMessage: 'Test message',
        },
      };
      it('returns see staff message', () => {
        const selectSeeStaffMessage = makeSelectSeeStaffMessage();
        expect(selectSeeStaffMessage(state)).to.eql({
          message: 'Test message',
        });
      });
    });
    describe('makeSelectApp', () => {
      const state = {
        checkInData: {
          app: 'preCheckIn',
        },
      };
      it('returns app name', () => {
        const selectApp = makeSelectApp();
        expect(selectApp(state)).to.eql({
          app: 'preCheckIn',
        });
      });
    });
    describe('makeSelectPendingEdits', () => {
      const state = {
        checkInData: {
          context: {
            pendingEdits: {
              key: 'emailAddress',
              value: 'some@email.com',
            },
          },
        },
      };
      it('returns pending edits', () => {
        const selectPendingEdits = makeSelectPendingEdits();
        expect(selectPendingEdits(state)).to.eql({
          pendingEdits: {
            key: 'emailAddress',
            value: 'some@email.com',
          },
        });
      });
    });
  });
});
