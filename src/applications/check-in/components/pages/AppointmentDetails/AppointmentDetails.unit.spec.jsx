/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { format, add } from 'date-fns';
import AppointmentDetails from './index';
import {
  multipleAppointments,
  singleAppointment,
} from '../../../tests/unit/mocks/mock-appointments';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('check-in experience', () => {
  describe('shared components', () => {
    const initAppointments = [...multipleAppointments, ...singleAppointment];
    const now = format(new Date(), "yyyy-LL-dd'T'HH:mm:ss");
    initAppointments[0] = {
      ...initAppointments[0],
      kind: 'phone',
      appointmentIen: 1111,
      stationNo: '0001',
      clinicIen: '0001',
    };
    initAppointments[1] = {
      ...initAppointments[1],
      kind: 'clinic',
      appointmentIen: 2222,
      clinicStopCodeName: 'stop code test',
      doctorName: 'test doc',
      stationNo: '0001',
      clinicIen: '0001',
    };
    initAppointments[2] = {
      ...initAppointments[2],
      kind: 'clinic',
      appointmentIen: 3333,
      startTime: now,
      checkInWindowEnd: format(
        add(new Date(), { minutes: 30 }),
        "yyyy-LL-dd'T'HH:mm:ss",
      ),
      stationNo: '0001',
      clinicIen: '0001',
      clinicStopCodeName: '',
    };
    initAppointments[3] = {
      ...initAppointments[3],
      kind: 'clinic',
      appointmentIen: 4444,
      eligibility: 'INELIGIBLE_BAD_STATUS',
      stationNo: '0001',
      clinicIen: '0001',
    };
    delete initAppointments[0].clinicPhoneNumber;
    delete initAppointments[0].doctorName;
    delete initAppointments[0].clinicStopCodeName;
    const preCheckInStore = {
      app: 'preCheckIn',
      appointments: initAppointments,
    };
    const preCheckInStoreWith45MinuteFlag = {
      app: 'preCheckIn',
      appointments: initAppointments,
      features: {
        check_in_experience_45_minute_reminder: true,
      },
    };
    const dayOfCheckInStore = {
      app: 'dayOf',
      appointments: initAppointments,
    };
    const appointmentOneRoute = {
      currentPage: '/appointment',
      params: {
        appointmentId: '1111-0001',
      },
    };
    const appointmentTwoRoute = {
      currentPage: '/appointment',
      params: {
        appointmentId: '2222-0001',
      },
    };
    const appointmentThreeRoute = {
      currentPage: '/appointment',
      params: {
        appointmentId: '3333-0001',
      },
    };
    const appointmentFourRoute = {
      currentPage: '/appointment',
      params: {
        appointmentId: '4444-0001',
      },
    };
    describe('AppointmentDetails', () => {
      describe('Phone pre-check-in appointment', () => {
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('header')).to.have.text('Phone appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('phone-appointment-subtitle')).to.exist;
        });
        it('renders clinic instead of where to attend', () => {
          const { getByRole } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByRole('heading', { name: 'Clinic', level: 2 })).to.exist;
        });
      });
      describe('In person pre-check-in appointment', () => {
        it('renders correct heading for appointment type', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('header')).to.have.text('In-person appointment');
        });
        it('renders correct subtitle', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('in-person-appointment-subtitle')).to.exist;
        });
        it('renders correct subtitle for 45 minute reminder feature flag', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStoreWith45MinuteFlag}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('in-person-45-minute-subtitle')).to.exist;
        });
        it('renders where to attend instead of clinic', () => {
          const { getByRole } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByRole('heading', { name: 'Where to attend', level: 2 })).to
            .exist;
        });
      });
      describe('All appointments - data exists', () => {
        it('renders stopcode if exists', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('stop code test');
        });
        it('renders doctor name if exists', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('appointment-details--provider')).to.exist;
        });
        it('renders phone number if available', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentTwoRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('appointment-details--phone')).to.exist;
        });
      });
      describe("All appointments - data doesn't exist", () => {
        it('renders VA appointment when no stopcode', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('VA Appointment');
        });
        it('renders generic appointment if stopCodeName is empty string', () => {
          const { getByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentThreeRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(
            getByTestId('appointment-details--appointment-value'),
          ).to.have.text('VA Appointment');
        });
        it('does not render doctor name if missing', () => {
          const { queryByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(queryByTestId('appointment-details--provider')).to.not.exist;
        });
        it('does not render phone number', () => {
          const { queryByTestId } = render(
            <CheckInProvider
              store={preCheckInStore}
              router={appointmentOneRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(queryByTestId('appointment-details--phone')).to.not.exist;
        });
      });
      describe('Day-of check-in eligible appointment', () => {
        it('Renders the check-in button and no message', () => {
          const { getByTestId, queryByTestId } = render(
            <CheckInProvider
              store={dayOfCheckInStore}
              router={appointmentThreeRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('check-in-button')).to.exist;
          expect(queryByTestId('appointment-action-message')).to.not.exist;
        });
      });
      describe('Day-of check-in ineligible appointment', () => {
        it('Renders the check-in button and no message', () => {
          const { getByTestId, queryByTestId } = render(
            <CheckInProvider
              store={dayOfCheckInStore}
              router={appointmentFourRoute}
            >
              <AppointmentDetails />
            </CheckInProvider>,
          );
          expect(getByTestId('appointment-action-message')).to.exist;
          expect(queryByTestId('check-in-button')).to.not.exist;
        });
      });
    });
  });
});
