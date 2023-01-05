/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import AppointmentDetails from './index';
import i18n from '../../../utils/i18n/i18n';
import { multipleAppointments } from '../../../tests/unit/mocks/mock-appointments';

describe('check-in experience', () => {
  describe('shared components', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initAppointments = [...multipleAppointments];

    initAppointments[0] = {
      ...initAppointments[0],
      kind: 'phone',
      appointmentIen: 1111,
    };
    initAppointments[1] = {
      ...initAppointments[0],
      kind: 'clinic',
      appointmentIen: 2222,
      clinicStopCodeName: 'stop code test',
      doctorName: 'test doc',
    };
    delete initAppointments[0].clinicPhoneNumber;

    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        appointments: initAppointments,
        veteranData: {
          demographics: {},
        },
        form: {
          pages: [],
        },
      },
    };
    const phoneState = {
      ...JSON.parse(JSON.stringify(initState)),
      ...scheduledDowntimeState,
    };
    phoneState.checkInData.form.activeAppointment = 1111;
    const inPersonState = {
      ...JSON.parse(JSON.stringify(initState)),
      ...scheduledDowntimeState,
    };
    inPersonState.checkInData.form.activeAppointment = 2222;
    describe('AppointmentDetails', () => {
      describe('Phone appointment', () => {
        const phoneStore = mockStore(phoneState);
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('header')).to.have.text('Phone appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('phone-appointment-subtitle')).to.exist;
        });
        it('renders clinic instead of where to attend', () => {
          const { getByRole } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByRole('heading', { name: 'Clinic', level: 2 })).to.exist;
        });
      });
      describe('In person appointment', () => {
        const inPersonStore = mockStore(inPersonState);
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('header')).to.have.text('In person appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('in-person-appointment-subtitle')).to.exist;
        });
        it('renders where to attend instead of clinic', () => {
          const { getByRole } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByRole('heading', { name: 'Where to attend', level: 2 })).to
            .exist;
        });
      });
      describe('All appointments - data exists', () => {
        const existStore = mockStore(inPersonState);
        it('renders stopcode if exists', () => {
          const { getByTestId } = render(
            <Provider store={existStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('stop code test');
        });
        it('renders doctor name if exists', () => {
          const { getByTestId } = render(
            <Provider store={existStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('appointment-details--provider')).to.exist;
        });
        it('renders phone number if available', () => {
          const { getByTestId } = render(
            <Provider store={existStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('appointment-details--phone')).to.exist;
        });
        // TBD
        // it('renders reason for visit if available', () => {

        // });
      });
      describe("All appointments - data doesn't exist", () => {
        const notExistStore = mockStore(phoneState);
        it('renders VA appointment when no stopcode', () => {
          const { getByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('VA Appointment');
        });
        it('does not render doctor name if missing', () => {
          const { queryByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(queryByTestId('appointment-details--provider')).to.not.exist;
        });
        it('does not render phone number', () => {
          const { queryByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails />
              </I18nextProvider>
            </Provider>,
          );
          expect(queryByTestId('appointment-details--phone')).to.not.exist;
        });
        // TBD
        // it('does not render reason for visit', () => {

        // });
      });
    });
  });
});
