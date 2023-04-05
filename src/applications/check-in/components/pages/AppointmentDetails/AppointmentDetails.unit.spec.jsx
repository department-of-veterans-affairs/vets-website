/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { format, add } from 'date-fns';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import AppointmentDetails from './index';
import i18n from '../../../utils/i18n/i18n';
import {
  multipleAppointments,
  singleAppointment,
} from '../../../tests/unit/mocks/mock-appointments';

describe('check-in experience', () => {
  describe('shared components', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initAppointments = [...multipleAppointments, ...singleAppointment];
    const now = format(new Date(), "yyyy-LL-dd'T'HH:mm:ss");
    initAppointments[0] = {
      ...initAppointments[0],
      kind: 'phone',
      appointmentIen: 1111,
      stationNo: '230',
    };
    initAppointments[1] = {
      ...initAppointments[1],
      kind: 'clinic',
      appointmentIen: 2222,
      clinicStopCodeName: 'stop code test',
      doctorName: 'test doc',
      stationNo: '230',
    };
    initAppointments[2] = {
      ...initAppointments[2],
      kind: 'clinic',
      appointmentIen: 3333,
      startTime: now,
      checkInWindowEnd: add(now, { minutes: 30 }),
      stationNo: '230',
      clinicStopCodeName: '',
    };
    initAppointments[3] = {
      ...initAppointments[3],
      kind: 'clinic',
      appointmentIen: 4444,
      eligibility: 'INELIGIBLE_BAD_STATUS',
      stationNo: '230',
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
        app: 'preCheckIn',
      },
    };
    const preCheckInState = {
      ...JSON.parse(JSON.stringify(initState)),
      ...scheduledDowntimeState,
    };
    const dayOfState = {
      ...JSON.parse(JSON.stringify(initState)),
      ...scheduledDowntimeState,
    };
    dayOfState.checkInData.app = 'dayOf';
    describe('AppointmentDetails', () => {
      describe('Phone pre-check-in appointment', () => {
        const phoneStore = mockStore(preCheckInState);
        const mockRouter = {
          params: {
            appointmentId: '1111-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('header')).to.have.text('Phone appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('phone-appointment-subtitle')).to.exist;
        });
        it('renders clinic instead of where to attend', () => {
          const { getByRole } = render(
            <Provider store={phoneStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByRole('heading', { name: 'Clinic', level: 2 })).to.exist;
        });
      });
      describe('In person pre-check-in appointment', () => {
        const mockRouter = {
          params: {
            appointmentId: '2222-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        const inPersonStore = mockStore(preCheckInState);
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('header')).to.have.text('In person appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('in-person-appointment-subtitle')).to.exist;
        });
        it('renders where to attend instead of clinic', () => {
          const { getByRole } = render(
            <Provider store={inPersonStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByRole('heading', { name: 'Where to attend', level: 2 })).to
            .exist;
        });
      });
      describe('All appointments - data exists', () => {
        const existStore = mockStore(preCheckInState);
        const mockRouter = {
          params: {
            appointmentId: '2222-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        it('renders stopcode if exists', () => {
          const { getByTestId } = render(
            <Provider store={existStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
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
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('appointment-details--provider')).to.exist;
        });
        it('renders phone number if available', () => {
          const { getByTestId } = render(
            <Provider store={existStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
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
        const notExistStore = mockStore(preCheckInState);
        const mockRouter = {
          params: {
            appointmentId: '1111-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        it('renders VA appointment when no stopcode', () => {
          const { getByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('VA Appointment');
        });
        it('renders generic appointment if stopCodeName is empty string', () => {
          const stopCodeRouter = {
            params: {
              appointmentId: '3333-230',
            },
            location: {
              pathname: '/appointment',
            },
          };
          const { getByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={stopCodeRouter} />
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
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(queryByTestId('appointment-details--provider')).to.not.exist;
        });
        it('does not render phone number', () => {
          const { queryByTestId } = render(
            <Provider store={notExistStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(queryByTestId('appointment-details--phone')).to.not.exist;
        });
        // TBD
        // it('does not render reason for visit', () => {

        // });
      });
      describe('Day-of check-in eligible appointment', () => {
        const dayOfEligibleStore = mockStore(dayOfState);
        const mockRouter = {
          params: {
            appointmentId: '3333-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        it('Renders the check-in button and no message', () => {
          const { getByTestId, queryByTestId } = render(
            <Provider store={dayOfEligibleStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('check-in-button')).to.exist;
          expect(queryByTestId('appointment-action-message')).to.not.exist;
        });
      });
      describe('Day-of check-in ineligible appointment', () => {
        const dayOfIneligibleStore = mockStore(dayOfState);
        const mockRouter = {
          params: {
            appointmentId: '4444-230',
          },
          location: {
            pathname: '/appointment',
          },
        };
        it('Renders the check-in button and no message', () => {
          const { getByTestId, queryByTestId } = render(
            <Provider store={dayOfIneligibleStore}>
              <I18nextProvider i18n={i18n}>
                <AppointmentDetails router={mockRouter} />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('appointment-action-message')).to.exist;
          expect(queryByTestId('check-in-button')).to.not.exist;
        });
      });
    });
  });
});
