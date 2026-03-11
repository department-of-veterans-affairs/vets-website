import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { addDays, subDays, subMonths } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import sinon from 'sinon';
import AppointmentsPage from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import { mockAppointmentsApi } from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCommunityCare: false,
  },
};

describe('VAOS Page: AppointmentsPage', () => {
  let sandbox;

  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    sandbox = sinon.createSandbox();

    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      response: [new MockAppointmentResponse()],
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 30),
      end: addDays(new Date(), 395),
      includes: ['facilities', 'clinics', 'eps'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      response: [new MockAppointmentResponse()],
    });
    mockAppointmentsApi({
      start: subMonths(new Date(), 3),
      end: new Date(),
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      response: [new MockAppointmentResponse()],
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 1),
      statuses: ['proposed', 'cancelled'],
      response: MockAppointmentResponse.createCCResponses({
        pending: true,
        status: APPOINTMENT_STATUS.proposed,
      }),
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 1),
      includes: ['facilities', 'clinics', 'eps'],
      statuses: ['proposed', 'cancelled'],
      response: MockAppointmentResponse.createCCResponses({
        pending: true,
        status: APPOINTMENT_STATUS.proposed,
      }),
    });
  });
  afterEach(() => {
    MockDate.reset();
    sandbox.restore();
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  it('should render warning message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaoswarning',
              description: 'My description',
              startTime: subDays(new Date(), '1')?.toISOString(),
              endTime: addDays(new Date(), '1')?.toISOString(),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('start scheduling button should open new appointment flow', async () => {
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: {
        ...initialState,
        user: userState,
      },
    });

    expect(screen.getByText(/Schedule a new appointment/)).to.be.ok;
    userEvent.click(
      await screen.findByRole('link', {
        name: /Schedule a new appointment/i,
      }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/schedule'),
    );
  });

  it('should display updated upcoming appointments page', async () => {
    // Given the veteran lands on the VAOS homepage
    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    // Then it should display the upcoming appointments
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Appointments',
      }),
    );
    await waitFor(() => {
      expect(global.document.title).to.equal(`Appointments | Veterans Affairs`);
    });

    // and breadcrumbs should be updated
    const navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.be.ok;
    expect(
      within(navigation).queryByRole('link', {
        name: 'Pending appointments',
      }),
    ).not.to.exist;
    expect(
      within(navigation).queryByRole('link', { name: 'Past appointments' }),
    ).not.to.exist;

    // and scheduling link should be displayed
    expect(screen.getByRole('link', { name: 'Schedule a new appointment' })).to
      .be.ok;

    // and appointment list navigation should be displayed
    expect(screen.getByRole('navigation', { name: 'Appointment list' })).to.be
      .ok;
    expect(screen.getByRole('link', { name: 'Upcoming' })).to.be.ok;
    expect(screen.getByRole('link', { name: /Pending \(\d\)/ })).to.be.ok;
    expect(screen.getByRole('link', { name: 'Past' })).to.be.ok;

    // and status dropdown should not be displayed
    expect(screen.queryByLabelText('Show by status')).not.to.exists;
  });

  it('should display updated appointment request page', async () => {
    // Given the veteran lands on the VAOS homepage
    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    // Then it should display upcoming appointments
    await screen.findByRole('heading', { name: 'Appointments' });

    // When the veteran clicks the Pending button
    let navigation = await screen.findByRole('link', {
      name: /^Pending \(1\)/,
    });
    userEvent.click(navigation);
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0].pathname).to.equal(
        '/pending',
      );
    });

    // Then it should display the requested appointments
    await waitFor(() => {
      expect(
        screen.findByRole('heading', {
          level: 1,
          name: 'Pending appointments',
        }),
      );
    });
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending appointments | Veterans Affairs`,
      );
    });

    // and breadcrumbs should be updated
    navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Pending appointments');

    expect(
      screen.getByText(
        'Appointments that you request will show here until staff review and schedule them.',
      ),
    ).to.be.ok;

    // and scheduling button should not be displayed
    expect(
      screen.queryByRole('button', {
        name: 'Schedule a new appointment',
      }),
    ).not.to.exist;

    // and status dropdown should not be displayed
    expect(screen.queryByLabelText('Show by status')).not.to.exists;

    expect(
      global.window.dataLayer.some(
        e => e === `vaos-status-pending-link-clicked`,
      ),
    );
  });

  it('should display updated past appointment page', async () => {
    // Given the veteran lands on the VAOS homepage
    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    // Then it should display the upcoming appointments
    await screen.findByRole('heading', { name: 'Appointments' });

    // When the veteran clicks the Past button
    let navigation = screen.getByRole('link', { name: 'Past' });
    userEvent.click(navigation);
    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0].pathname).to.equal('/past'),
    );

    // Then it should display the past appointments
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Past appointments',
      }),
    ).to.be.ok;
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Past appointments | Veterans Affairs`,
      );
    });

    // and breadcrumbs should be updated
    navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Past appointments');

    const dropdown = await screen.findByTestId('vaosSelect');

    // and date range dropdown should be displayed
    expect(dropdown).to.have.attribute('label', 'Select a date range');

    // and scheduling button should not be displayed
    expect(
      screen.queryByRole('button', {
        name: 'Schedule a new appointment',
      }),
    ).not.to.exist;

    // and status dropdown should not be displayed
    expect(screen.queryByLabelText('Show by status')).not.to.exists;

    expect(
      global.window.dataLayer.some(e => e === `vaos-status-past-link-clicked`),
    );
  });

  it('should show tertiary print button', async () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
      },
      user: userState,
    };

    // Given the veteran lands on the VAOS homepage
    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState: defaultState,
    });

    // Then it should display the tertiary print button
    expect(screen.getByTestId('print-list')).to.be.ok;
  });

  describe('community care referrals banner', () => {
    it('should display warning banner when user is in a pilot station', async () => {
      const pilotState = {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        user: userState,
      };

      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: pilotState,
      });

      await screen.findByRole('heading', { name: 'Appointments' });

      expect(screen.findByTestId('cc-referrals-banner')).to.exist;
      expect(screen.getByTestId('referral-community-care-office')).to.exist;

      expect(screen.getByRole('link', { name: /Pending \(\d\)/ })).to.exist;
    });

    it('should not display banner when user is not in a pilot station', async () => {
      const nonPilotState = {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '999', isCerner: false }],
          },
        },
      };

      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: nonPilotState,
      });

      await screen.findByRole('heading', { name: 'Appointments' });

      expect(screen.queryByTestId('cc-referrals-banner')).to.not.exist;
    });

    it('should not display banner when CC direct scheduling flag is off', async () => {
      const toggleOffState = {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingCCDirectScheduling: false,
        },
        user: userState,
      };

      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: toggleOffState,
      });

      await screen.findByRole('heading', { name: 'Appointments' });

      expect(screen.queryByTestId('cc-referrals-banner')).to.not.exist;
    });
  });
});
