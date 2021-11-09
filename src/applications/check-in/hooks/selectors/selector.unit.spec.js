import { expect } from 'chai';
import cloneDeep from 'platform/utilities/data/cloneDeep';

import {
  makeSelectCheckInData,
  makeSelectFeatureToggles,
  makeSelectContext,
  makeSelectConfirmationData,
  makeSelectAppointmentListData,
  makeSelectSeeStaffMessage,
} from './index';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        check_in_experience_enabled: true,
        check_in_experience_demographics_page_enabled: true,
        check_in_experience_update_information_page_enabled: true,
        check_in_experience_next_of_kin_enabled: false,
        loading: false,
        /* eslint-enable camelcase */
      },
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
        seeStaffMessage: 'Test message',
      },
    };

    describe('makeSelectCheckInData', () => {
      it('returns check-in data', () => {
        const selectCheckInData = makeSelectCheckInData();
        expect(selectCheckInData(state)).to.eql({
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
          seeStaffMessage: 'Test message',
        });
      });
      it('returns empty when check-in data is not available', () => {
        const partialState = cloneDeep(state);
        delete partialState.checkInData;
        const selectCheckInData = makeSelectCheckInData();
        expect(selectCheckInData(partialState)).to.eql({});
      });
    });
    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isCheckInEnabled: true,
          isDemographicsPageEnabled: true,
          isLoadingFeatureFlags: false,
          isNextOfKinEnabled: false,
          isUpdatePageEnabled: true,
        });
      });
    });
    describe('makeSelectContext', () => {
      it('returns check-in context', () => {
        const selectContext = makeSelectContext();
        expect(selectContext(state)).to.eql({
          appointment: {
            appointmentIen: 'some-ien',
          },
          token: 'foo',
        });
      });
      it('returns empty when check-in context is unavailable', () => {
        const partialState = cloneDeep(state);
        delete partialState.checkInData;
        const selectContext = makeSelectContext();
        expect(selectContext(partialState)).to.eql({});
      });
    });
    describe('makeSelectConfirmationData', () => {
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
    describe('makeSelectAppointmentListData', () => {
      it('returns appointment list data', () => {
        const selectAppointmentListData = makeSelectAppointmentListData();
        expect(selectAppointmentListData(state)).to.eql({
          appointments: [
            {
              clinicName: 'Green Team Clinic1',
              clinicPhone: '555-867-5309',
              facilityName: 'Acme VA',
              startTime: '2021-07-19T13:56:31',
            },
          ],
          context: {
            appointment: {
              appointmentIen: 'some-ien',
            },
            token: 'foo',
          },
        });
      });
      it('returns empty when appointment list data is not available', () => {
        const partialState = cloneDeep(state);
        delete partialState.checkInData.appointments;
        delete partialState.checkInData.context;
        const selectAppointmentListData = makeSelectAppointmentListData();
        expect(selectAppointmentListData(partialState)).to.eql({});
      });
    });
    describe('makeSelectSeeStaffMessage', () => {
      it('returns see staff message', () => {
        const selectSeeStaffMessage = makeSelectSeeStaffMessage();
        expect(selectSeeStaffMessage(state)).to.eql({
          message: 'Test message',
        });
      });
    });
  });
});
