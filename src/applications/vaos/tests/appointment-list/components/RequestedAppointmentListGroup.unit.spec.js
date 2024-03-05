import React from 'react';
import moment from 'moment';
import MockDate from 'mockdate';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import RequestedAppointmentsListGroup from '../../../appointment-list/components/RequestedAppointmentsListGroup';
import { getVAOSRequestMock } from '../../mocks/v2';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getTestDate, renderWithStoreAndRouter } from '../../mocks/setup';

describe('VAOS Component: RequestedAppointmentsList', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
    },
  };
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should display pending and canceled appointments grouped', async () => {
    // And a veteran has VA appointment request
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
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };
    const canceledAppointment = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        serviceType: '160',
        status: 'cancelled',
      },
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment, canceledAppointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState,
      },
    );

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;

    // And it hsould display the cancelled appointments
    expect(screen.getByRole('heading', { level: 2, name: 'Canceled requests' }))
      .to.be.ok;
    expect(screen.getByText('These appointment requests have been canceled.'))
      .to.be.ok;
  });

  it('should display pending appointments when there are no canceled appointments', async () => {
    // And a veteran has VA appointment request
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
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState,
      },
    );

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;

    // And cancelled appointments should not be displayed
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Canceled requests' }),
    ).not.to.be.ok;
    expect(screen.queryByText('These appointment requests have been canceled.'))
      .not.to.be.ok;

    // And the no appointments alert message should not be displayed
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: /You don’t have any/,
      }),
    ).not.to.be.ok;
  });

  it('should dispaly no appointments alert when there are no pending or cancelled appointments', async () => {
    // And a veteran has no pending or canceled appointment request
    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [{}],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState,
      },
    );

    // Then it should display the no appointments alert message
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
  });

  it('should display no appointments alert when there are no pending but cancelled appointments', async () => {
    // And a veteran has VA appointment request
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
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'cancelled',
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsListGroup />,
      {
        initialState,
      },
    );

    // Then it should display the requested appointments
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Canceled requests',
      }),
    ).to.be.ok;
    expect(screen.getByText('These appointment requests have been canceled.'))
      .to.be.ok;

    // And it should display the no appointments alert message
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
  });
});
