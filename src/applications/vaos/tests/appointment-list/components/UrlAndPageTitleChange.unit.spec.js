import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, within } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import AppointmentsPage from '../../../appointment-list/components/AppointmentsPage';
import {
  mockAppointmentInfo,
  mockPastAppointmentInfo,
} from '../../mocks/helpers';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../mocks/data';
import {
  mockVAOSAppointmentsFetch,
  mockSingleVAOSAppointmentFetch,
} from '../../mocks/helpers.v2';
import { getVAOSRequestMock, getVAOSAppointmentMock } from '../../mocks/v2';
import {
  mockFacilityFetchByVersion,
  mockSingleClinicFetchByVersion,
} from '../../mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingStatusImprovement: false,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS Page: AppointmentsPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockAppointmentInfo({});
  });
  afterEach(() => {
    MockDate.reset();
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  describe('when scheduling breadcrumb url update flag is on', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingStatusImprovement: true,
        vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      },
      user: userState,
    };

    it('should display updated title on upcoming appointments page', async () => {
      // Given the veteran lands on the VAOS homepage
      mockPastAppointmentInfo({});

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
      const pastDate = moment().subtract(3, 'months');
      const data = {
        id: '1234',
        kind: 'clinic',
        clinic: 'fake',
        start: pastDate.format(),
        locationId: '983GC',
        status: 'booked',
      };
      const appointment = createMockAppointmentByVersion({
        version: 0,
        ...data,
      });
      mockPastAppointmentInfo({ va: [appointment] });

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

    // WIP
    it.skip('should show confirmed appointment detail page with new URL', async () => {
      const myInitialState = {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
        },
      };

      const url = '1234';
      const futureDate = moment.utc();

      const appointment = getVAOSAppointmentMock();
      appointment.id = '1234';
      appointment.attributes = {
        ...appointment.attributes,
        kind: 'clinic',
        clinic: '455',
        locationId: '983GC',
        id: '1234',
        preferredTimesForPhoneCall: ['Morning'],
        reasonCode: {
          coding: [{ code: 'New Problem' }],
          text: 'I have a headache',
        },
        comment: 'New issue: I have a headache',
        serviceType: 'primaryCare',
        start: futureDate.format(),
        status: 'booked',
      };

      mockSingleClinicFetchByVersion({
        clinicId: '455',
        locationId: '983GC',
        clinicName: 'Some fancy clinic name',
        version: 2,
      });
      mockSingleVAOSAppointmentFetch({ appointment });

      mockFacilityFetchByVersion({
        facility: createMockFacilityByVersion({
          id: '983GC',
          name: 'Cheyenne VA Medical Center',
          phone: '970-224-1550',
          address: {
            postalCode: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            line: ['2360 East Pershing Boulevard'],
          },
        }),
      });

      const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
        initialState: myInitialState,
        path: url,
      });

      // Verify document title and content...
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });

      expect(
        screen.getByRole('heading', {
          level: 1,
          name: new RegExp(
            futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
            'i',
          ),
        }),
      ).to.be.ok;
      //
      //       expect(screen.getByText('Primary care')).to.be.ok;
      //       // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
      //       expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
      //       expect(await screen.findByText(/Some fancy clinic name/)).to.be.ok;
      //       expect(screen.getByTestId('facility-telephone')).to.exist;
      //       expect(
      //         screen.getByRole('heading', {
      //           level: 2,
      //           name: 'You shared these details about your concern',
      //         }),
      //       ).to.be.ok;
      //       expect(screen.getByText(/New Problem: I have a headache/)).to.be.ok;
      //       expect(
      //         screen.getByTestId('add-to-calendar-link', {
      //           name: new RegExp(
      //             futureDate
      //               .tz('America/Denver')
      //               .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
      //             'i',
      //           ),
      //         }),
      //       ).to.be.ok;
      //       expect(screen.getByText(/Print/)).to.be.ok;
      //       expect(screen.getByText(/Cancel appointment/)).to.be.ok;
      //
      //       expect(screen.baseElement).not.to.contain.text(
      //         'This appointment occurred in the past.',
      //       );
    });

    // WIP
    it.skip('should show past appointment detail page with new URL', async () => {
      return true;
    });

    // WIP
    it.skip('should show pending appointment detail page with new URL', async () => {
      return true;
    });

    it.skip('should show requested appointment detail page with new URL', async () => {
      return true;
    });
  });
});
