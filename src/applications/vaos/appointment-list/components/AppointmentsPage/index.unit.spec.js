import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, within } from '@testing-library/dom';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import {
  createTestStore,
  renderWithStoreAndRouter,
  getTestDate,
} from '../../../tests/mocks/setup';
import AppointmentsPage from '.';
import { mockVAOSAppointmentsFetch } from '../../../tests/mocks/helpers';
import { getVAOSRequestMock } from '../../../tests/mocks/mock';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCommunityCare: false,
  },
};

describe('VAOS Page: AppointmentsPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });
  afterEach(() => {
    MockDate.reset();
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
              externalService: 'vaosWarning',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
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

    expect(screen.getByText(/Start scheduling/)).to.be.ok;
    userEvent.click(
      await screen.findByRole('button', { name: /Start scheduling/i }),
    );

    await waitFor(() =>
      expect(screen.history.push.lastCall.args[0]).to.equal('/new-appointment'),
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
      expect(global.document.title).to.equal(
        `Appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    // and breadcrumbs should be updated
    const navigation = screen.getByRole('navigation', {
      name: 'Breadcrumbs',
    });
    expect(navigation).to.be.ok;
    expect(
      within(navigation).queryByRole('link', {
        name: 'Pending appointments',
      }),
    ).not.to.exist;
    expect(
      within(navigation).queryByRole('link', { name: 'Past appointments' }),
    ).not.to.exist;

    // and scheduling button should be displayed
    expect(
      screen.getByRole('button', { name: 'Start scheduling an appointment' }),
    ).to.be.ok;

    // and appointment list navigation should be displayed
    expect(
      screen.getByRole('navigation', { name: 'Appointment list navigation' }),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: 'Upcoming' })).to.be.ok;
    expect(screen.getByRole('link', { name: /Pending \(\d\)/ })).to.be.ok;
    expect(screen.getByRole('link', { name: 'Past' })).to.be.ok;

    // and status dropdown should not be displayed
    expect(screen.queryByLabelText('Show by status')).not.to.exists;
  });

  it('should display updated appointment request page', async () => {
    // Given the veteran lands on the VAOS homepage
    const appointment = getVAOSRequestMock();
    appointment.id = '1';
    appointment.attributes = {
      id: '1',
      kind: 'clinic',
      locationId: '983',
      requestedPeriods: [{}],
      serviceType: 'primaryCare',
      status: 'proposed',
    };

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(395, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [appointment],
    });
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

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
        `Pending appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    // and breadcrumbs should be updated
    navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
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
        name: 'Start scheduling an appointment',
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
        `Past appointments | VA online scheduling | Veterans Affairs`,
      );
    });

    // and breadcrumbs should be updated
    navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
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
        name: 'Start scheduling an appointment',
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
    expect(screen.getByRole('button', { name: 'print list' })).to.be.ok;
  });

  describe('when scheduling breadcrumb url update flag is on', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      },
      user: userState,
    };

    it('should display updated title on upcoming appointments page', async () => {
      // Given the veteran lands on the VAOS homepage
      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Appointments',
        }),
      );
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Appointments | Veterans Affairs`,
        );
      });

      // and breadcrumbs should be updated
      const navigation = screen.getByRole('navigation', {
        name: 'Breadcrumbs',
      });
      expect(navigation).to.be.ok;
      expect(within(navigation).queryByRole('link', { name: 'Pending' })).not.to
        .exist;
      expect(within(navigation).queryByRole('link', { name: 'Past' })).not.to
        .exist;

      // and scheduling button should be displayed
      expect(
        screen.getByRole('button', { name: 'Start scheduling an appointment' }),
      ).to.be.ok;

      // and appointment list navigation should be displayed
      expect(
        screen.getByRole('navigation', { name: 'Appointment list navigation' }),
      ).to.be.ok;
      expect(screen.getByRole('link', { name: 'Upcoming' })).to.be.ok;
      expect(screen.getByRole('link', { name: /Pending \(\d\)/ })).to.be.ok;
      expect(screen.getByRole('link', { name: 'Past' })).to.be.ok;

      // and status dropdown should not be displayed
      expect(screen.queryByLabelText('Show by status')).not.to.exists;
    });

    it('should display updated title on pending appointments page', async () => {
      // Given the veteran lands on the VAOS homepage
      const appointment = getVAOSRequestMock();
      appointment.id = '1';
      appointment.attributes = {
        id: '1',
        kind: 'clinic',
        locationId: '983',
        requestedPeriods: [{}],
        serviceType: 'primaryCare',
        status: 'proposed',
      };

      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD'),
        end: moment()
          .add(395, 'days')
          .format('YYYY-MM-DD'),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        requests: [appointment],
      });
      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        statuses: ['proposed', 'cancelled'],
        requests: [appointment],
      });

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: defaultState,
      });

      // Then it should display upcoming appointments
      await screen.findByRole('heading', { name: 'Appointments' });

      // When the veteran clicks the Pending button
      const navigation = await screen.findByRole('link', {
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

      expect(
        global.window.dataLayer.some(
          e => e === `vaos-status-pending-link-clicked`,
        ),
      );
    });

    it('should display updated past appointments page title', async () => {
      // Given the veteran lands on the VAOS homepage
      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      await screen.findByRole('heading', { name: 'Appointments' });

      // When the veteran clicks the Past button
      const navigation = screen.getByRole('link', { name: 'Past' });
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

      expect(
        global.window.dataLayer.some(
          e => e === `vaos-status-past-link-clicked`,
        ),
      );
    });
  });

  describe('when CC direct scheduling flag is on', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      user: userState,
    };

    it('should display reivew request and referrals link', async () => {
      // Given the veteran lands on the VAOS homepage
      const appointment = getVAOSRequestMock();
      appointment.id = '1';
      appointment.attributes = {
        id: '1',
        kind: 'clinic',
        locationId: '983',
        requestedPeriods: [{}],
        serviceType: 'primaryCare',
        status: 'proposed',
      };

      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD'),
        end: moment()
          .add(395, 'days')
          .format('YYYY-MM-DD'),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        requests: [appointment],
      });
      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        statuses: ['proposed', 'cancelled'],
        requests: [appointment],
      });
      // Given the veteran lands on the VAOS homepage
      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      await screen.findByRole('heading', { name: 'Appointments' });

      expect(await screen.findByTestId('review-requests-and-referrals')).to
        .exist;

      expect(screen.queryByRole('link', { name: /Pending \(1\)/ })).not.to
        .exist;
    });
  });
});
