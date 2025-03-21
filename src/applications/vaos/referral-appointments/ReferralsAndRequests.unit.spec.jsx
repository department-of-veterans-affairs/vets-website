import React from 'react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import MockDate from 'mockdate';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import ReferralsAndRequests from './ReferralsAndRequests';
import { getVAOSRequestMock } from '../tests/mocks/mock';
import reducers from '../redux/reducer';
import { mockVAOSAppointmentsFetch } from '../tests/mocks/helpers';
import { getTestDate, renderWithStoreAndRouter } from '../tests/mocks/setup';
import { createReferrals } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingCCDirectScheduling: true,
  },
};

describe('VAOS Component: Referrals and Requests', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });
  it('should display referrals if there are referrals', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: createReferrals(3, '2024-11-20'),
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByText('Referrals and requests')).to.exist;
    expect(screen.getByTestId('referral-list')).to.exist;
  });
  it('should display error message if both calls fail', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: createReferrals(3, '2024-11-20'),
        referralsFetchStatus: FETCH_STATUS.failed,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.failed,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByText('We’re sorry. We’ve run into a problem')).to.exist;
  });
  it('should display error message if both calls fail', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: [],
        referralsFetchStatus: FETCH_STATUS.failed,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.failed,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByText('We’re sorry. We’ve run into a problem')).to.exist;
  });
  it('should display loading if one or more are loading', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: [],
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.loading,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
  it('should display referral error message if referrals fail', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: [],
        referralsFetchStatus: FETCH_STATUS.failed,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(
      screen.getByText(
        'We’re sorry. We can’t retrieve your community care referrals at this time. Please try again later.',
      ),
    ).to.exist;
  });
  it('should display requests error message if requests fail', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: [],
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.failed,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(
      screen.getByText(
        'We’re having trouble getting your appointment requests. Please try again later.',
      ),
    ).to.exist;
  });
  it('should display no referrals message if there are no referrals', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: [],
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByText('You don’t have any referrals')).to.exist;
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
        .add(2, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment, canceledAppointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care request')).to.be.ok;
    expect(screen.getByRole('heading', { level: 2, name: 'Active requests' }))
      .to.be.ok;

    // And it should display the cancelled appointments
    expect(screen.getByRole('heading', { level: 2, name: 'Canceled requests' }))
      .to.be.ok;
    expect(screen.getByTestId('appointments-cancelled-text')).to.exist;
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
        .add(2, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care request')).to.be.ok;

    // And cancelled appointments should not be displayed
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Canceled requests' }),
    ).not.to.be.ok;
    expect(screen.queryByTestId('appointments-cancelled-text')).to.not.exist;

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
        .add(2, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [{}],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the no appointments alert message
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    userEvent.click(screen.queryByTestId('schedule-appointment-link'));
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
        .add(2, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Canceled requests',
      }),
    ).to.be.ok;
    expect(screen.getByTestId('appointments-cancelled-text')).to.exist;

    // And it should display the no appointments alert message
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
  });
});
