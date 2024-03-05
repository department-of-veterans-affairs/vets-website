import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import { AppointmentList } from '../../../appointment-list';
import PastAppointmentsList from '../../../appointment-list/components/PastAppointmentsList';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { createMockAppointmentByVersion } from '../../mocks/data';
import { getVAOSAppointmentMock, getVAOSRequestMock } from '../../mocks/v2';
import RequestedAppointmentsListGroup from '../../../appointment-list/components/RequestedAppointmentsListGroup';

describe('VAOS Backend Service Alert', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingVAOSServiceCCAppointments: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
      // eslint-disable-next-line camelcase
      show_new_schedule_view_appointments_page: true,
    },
  };

  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockAppointmentInfo({});
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should display BackendAppointmentServiceAlert if there is a failure returned on the upcoming appointments list', async () => {
    const appointmentTime = moment().add(1, 'days');
    const start = moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD');
    const end = moment()
      .add(395, 'days')
      .format('YYYY-MM-DD');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      serviceType: 'audiology',
      reasonCode: {
        text: 'test comment',
      },
    };
    const appointment = createMockAppointmentByVersion({
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['proposed', 'cancelled'],
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      backendServiceFailures: true,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there is no failure returned the upcoming appointments list', async () => {
    const appointmentTime = moment().add(1, 'days');
    const start = moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD');
    const end = moment()
      .add(395, 'days')
      .format('YYYY-MM-DD');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      serviceType: 'audiology',
      reasonCode: {
        text: 'test comment',
      },
    };
    const appointment = createMockAppointmentByVersion({
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(4, 'months')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
      .exist;
  });

  it('should display BackendAppointmentServiceAlert if there is a failure returned on the past appointments list', async () => {
    const now = moment().startOf('day');
    const start = moment(now).subtract(3, 'months');
    const end = moment()
      .minutes(0)
      .add(30, 'minutes');

    const yesterday = moment.utc().subtract(1, 'day');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      minutesDuration: 30,
      status: 'booked',
      localStartTime: yesterday.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: yesterday.format(),
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
    };

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      backendServiceFailures: true,
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there is no failure returned on the past appointments list', async () => {
    const now = moment().startOf('day');
    const start = moment(now).subtract(3, 'months');
    const end = moment()
      .minutes(0)
      .add(30, 'minutes');

    const yesterday = moment.utc().subtract(1, 'day');
    const appointment = getVAOSAppointmentMock();
    appointment.id = '123';
    appointment.attributes = {
      ...appointment.attributes,
      minutesDuration: 30,
      status: 'booked',
      localStartTime: yesterday.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: yesterday.format(),
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
    };

    mockVAOSAppointmentsFetch({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      backendServiceFailures: false,
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
        .exist;
    });
  });

  it('should display BackendAppointmentServiceAlert if there is a failure returned on the pending appointments list', async () => {
    const startDate = moment.utc();

    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: moment(startDate)
            .add(3, 'days')
            .format('YYYY-MM-DD'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DD'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
      backendServiceFailures: true,
    });

    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            ...initialState.featureToggles,
            vaOnlineSchedulingVAOSServiceRequests: true,
          },
        },
      },
    );

    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there no failure returned on the pending appointments list', async () => {
    const startDate = moment.utc();

    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: moment(startDate)
            .add(3, 'days')
            .format('YYYY-MM-DD'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DD'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
      backendServiceFailures: false,
    });

    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            ...initialState.featureToggles,
            vaOnlineSchedulingVAOSServiceRequests: true,
          },
        },
      },
    );

    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
        .exist;
    });
  });
});
