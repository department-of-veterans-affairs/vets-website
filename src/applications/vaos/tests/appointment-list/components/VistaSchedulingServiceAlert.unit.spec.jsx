import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, within } from '@testing-library/dom';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import userEvent from '@testing-library/user-event';
import {
  createTestStore,
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import AppointmentsPageV2 from '../../../appointment-list/components/AppointmentsPageV2';
import {
  mockAppointmentInfo,
  mockPastAppointmentInfo,
} from '../../mocks/helpers';
import { getVARequestMock } from '../../mocks/v0';
import { createMockAppointmentByVersion } from '../../mocks/data';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <AppointmentsPageV2>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
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

  describe('when vaOnlineSchedulingVAOSV2Next flag is on', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingStatusImprovement: true,
        vaOnlineSchedulingVAOSV2Next: true,
      },
      user: userState,
    };

    it('should display the VistA Scheduling Service Alert if a failure is present', async () => {
      // Given the veteran lands on the VAOS homepage
      mockPastAppointmentInfo({});

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Your appointments',
        }),
      );
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Your appointments | VA online scheduling | Veterans Affairs`,
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
      expect(screen.getByRole('button', { name: /Pending \(\d\)/ })).to.be.ok;
      expect(screen.getByRole('button', { name: 'Past' })).to.be.ok;

      // and status dropdown should not be displayed
      // expect(screen.queryByLabelText('Show by status')).not.to.exists;

      expect(screen.queryByText("We can't display in-person VA appointments"))
        .to.exist;
      screen.debug();
    });

    //     it('should not display the Vista Scheduling Service Alert if there is no failure present', async () => {
    //       // Given the veteran lands on the VAOS homepage
    //       mockPastAppointmentInfo({});
    //
    //       // When the page displays
    //       const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
    //         initialState: defaultState,
    //       });
    //
    //       // Then it should display the upcoming appointments
    //       expect(
    //         await screen.findByRole('heading', {
    //           level: 1,
    //           name: 'Your appointments',
    //         }),
    //       );
    //       await waitFor(() => {
    //         expect(global.document.title).to.equal(
    //           `Your appointments | VA online scheduling | Veterans Affairs`,
    //         );
    //       });
    //
    //       // and breadcrumbs should be updated
    //       const navigation = screen.getByRole('navigation', {
    //         name: 'Breadcrumbs',
    //       });
    //       expect(navigation).to.be.ok;
    //       expect(within(navigation).queryByRole('link', { name: 'Pending' })).not.to
    //         .exist;
    //       expect(within(navigation).queryByRole('link', { name: 'Past' })).not.to
    //         .exist;
    //
    //       // and scheduling button should be displayed
    //       expect(
    //         screen.getByRole('button', { name: 'Start scheduling an appointment' }),
    //       ).to.be.ok;
    //
    //       // and appointment list navigation should be displayed
    //       expect(
    //         screen.getByRole('navigation', { name: 'Appointment list navigation' }),
    //       ).to.be.ok;
    //       expect(screen.getByRole('button', { name: /Pending \(\d\)/ })).to.be.ok;
    //       expect(screen.getByRole('button', { name: 'Past' })).to.be.ok;
    //
    //       // and status dropdown should not be displayed
    //       expect(screen.queryByLabelText('Show by status')).not.to.exists;
    //       // screen.debug();
    //     });
  });

  describe('when vaOnlineSchedulingVAOSV2Next flag is off', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingStatusImprovement: true,
        vaOnlineSchedulingVAOSV2Next: false,
      },
      user: userState,
    };

    it('should not display the VistA Scheduling Service Alert if a failure is present', async () => {
      // Given the veteran lands on the VAOS homepage
      mockPastAppointmentInfo({});

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Your appointments',
        }),
      );
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Your appointments | VA online scheduling | Veterans Affairs`,
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
      expect(screen.getByRole('button', { name: /Pending \(\d\)/ })).to.be.ok;
      expect(screen.getByRole('button', { name: 'Past' })).to.be.ok;

      // and status dropdown should not be displayed
      // expect(screen.queryByLabelText('Show by status')).not.to.exists;

      expect(screen.queryByText("We can't display in-person VA appointments"))
        .not.to.exist;
    });

    //     it('should not display the Vista Scheduling Service Alert if there is no failure present', async () => {
    //       // Given the veteran lands on the VAOS homepage
    //       mockPastAppointmentInfo({});
    //
    //       // When the page displays
    //       const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
    //         initialState: defaultState,
    //       });
    //
    //       // Then it should display the upcoming appointments
    //       expect(
    //         await screen.findByRole('heading', {
    //           level: 1,
    //           name: 'Your appointments',
    //         }),
    //       );
    //       await waitFor(() => {
    //         expect(global.document.title).to.equal(
    //           `Your appointments | VA online scheduling | Veterans Affairs`,
    //         );
    //       });
    //
    //       // and breadcrumbs should be updated
    //       const navigation = screen.getByRole('navigation', {
    //         name: 'Breadcrumbs',
    //       });
    //       expect(navigation).to.be.ok;
    //       expect(within(navigation).queryByRole('link', { name: 'Pending' })).not.to
    //         .exist;
    //       expect(within(navigation).queryByRole('link', { name: 'Past' })).not.to
    //         .exist;
    //
    //       // and scheduling button should be displayed
    //       expect(
    //         screen.getByRole('button', { name: 'Start scheduling an appointment' }),
    //       ).to.be.ok;
    //
    //       // and appointment list navigation should be displayed
    //       expect(
    //         screen.getByRole('navigation', { name: 'Appointment list navigation' }),
    //       ).to.be.ok;
    //       expect(screen.getByRole('button', { name: /Pending \(\d\)/ })).to.be.ok;
    //       expect(screen.getByRole('button', { name: 'Past' })).to.be.ok;
    //
    //       // and status dropdown should not be displayed
    //       expect(screen.queryByLabelText('Show by status')).not.to.exists;
    //       // screen.debug();
    //     });
  });
});
