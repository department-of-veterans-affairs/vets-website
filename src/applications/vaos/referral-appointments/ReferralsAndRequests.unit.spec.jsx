import React from 'react';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import MockDate from 'mockdate';
import ReferralsAndRequests from './ReferralsAndRequests';
import reducers from '../redux/reducer';
import { getTestDate, renderWithStoreAndRouter } from '../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../utils/constants';
import MockAppointmentResponse from '../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../tests/fixtures/MockFacilityResponse';
import MockReferralListResponse from '../tests/fixtures/MockReferralListResponse';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingCCDirectScheduling: true,
  },
};

const referralsAPIEndpoint = 'https://dev-api.va.gov/vaos/v2/referrals';
const appointmentsAPIEndpoint = 'https://dev-api.va.gov/vaos/v2/appointments';

describe('VAOS Component: Referrals and Requests', () => {
  // Global server is managed by mocha-setup.js (listen/close)
  beforeEach(() => {
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
    server.resetHandlers();
  });

  it('should display referrals if there are referrals', async () => {
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.proposed,
    }).setLocation(new MockFacilityResponse());
    const referralsResponse = new MockReferralListResponse({
      numberOfReferrals: 3,
    });
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse(referralsResponse, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () => {
        return jsonResponse({ data: [appointment] }, { status: 200 });
      }),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });

    waitFor(() => {
      expect(screen.getByText('Referrals and requests')).to.exist;
      expect(screen.getByTestId('referral-list')).to.exist;
    });
  });

  it('should display error message if both calls fail if failed action is called', async () => {
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse(null, { status: 500 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse(null, { status: 500 }),
      ),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    waitFor(() => {
      expect(screen.getByText('We’re sorry. We’ve run into a problem')).to
        .exist;
    });
  });

  it('should display loading if one or more are loading', async () => {
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.proposed,
    }).setLocation(new MockFacilityResponse());
    const referralsResponse = new MockReferralListResponse({
      numberOfReferrals: 3,
    });
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse(referralsResponse, { status: 500 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [appointment] }, { status: 200 }),
      ),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('should display referral error message if referrals fail', async () => {
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse(null, { status: 500 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    waitFor(() => {
      expect(
        screen.getByText(
          'We’re having trouble getting your community care referrals. Please try again later.',
        ),
      ).to.exist;
    });
  });

  it('should display requests error message if requests fail', async () => {
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse(null, { status: 500 }),
      ),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });

    waitFor(() => {
      expect(
        screen.getByText(
          'We’re having trouble getting your requests. Please try again later.',
        ),
      ).to.exist;
    });
  });

  it('should display no referrals message if there are no referrals', async () => {
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );
    const initialState = {
      ...initialStateVAOSService,
    };
    const screen = renderWithStoreAndRouter(<ReferralsAndRequests />, {
      initialState,
    });
    waitFor(() => {
      expect(screen.getByText('You don’t have any referrals')).to.exist;
    });
  });

  it('should display pending and canceled appointments grouped', async () => {
    // And a veteran has VA appointment request
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.proposed,
    }).setLocation(new MockFacilityResponse());
    const canceledAppointment = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        serviceType: '160',
        status: 'cancelled',
      },
    };

    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse(
          { data: [appointment, canceledAppointment] },
          { status: 200 },
        ),
      ),
    );

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
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.proposed,
    }).setLocation(new MockFacilityResponse());
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [appointment] }, { status: 200 }),
      ),
    );

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
        name: 'You don’t have any appointment requests',
      }),
    ).not.to.be.ok;
  });

  it('should dispaly no appointments alert when there are no pending or cancelled appointments', async () => {
    // And a veteran has no pending or canceled appointment request
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

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
        name: 'You don’t have any appointment requests',
      }),
    ).to.be.ok;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    userEvent.click(screen.queryByTestId('schedule-appointment-link'));
  });

  it('should display no appointments alert when there are no pending but cancelled appointments', async () => {
    const startDate = new Date();
    const cancelledAppointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.cancelled,
    })
      .setRequestedPeriods([startDate])
      .setLocation(new MockFacilityResponse());
    // And a veteran has VA appointment request
    server.use(
      createGetHandler(referralsAPIEndpoint, () =>
        jsonResponse({ data: [] }, { status: 200 }),
      ),
    );

    server.use(
      createGetHandler(appointmentsAPIEndpoint, () =>
        jsonResponse({ data: [cancelledAppointment] }, { status: 200 }),
      ),
    );

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
        name: 'You don’t have any appointment requests',
      }),
    ).to.be.ok;
  });
});
