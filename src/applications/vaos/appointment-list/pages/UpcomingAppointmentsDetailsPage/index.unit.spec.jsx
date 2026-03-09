import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { addDays, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import MockDate from 'mockdate';
import React from 'react';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS, DATE_FORMATS } from '../../../utils/constants';

import { AppointmentList } from '../..';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import {
  mockAppointmentApi,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFacilityApi,
} from '../../../tests/mocks/mockApis';

describe('VAOS Page: ConfirmedAppointmentDetailsPage with VAOS service', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingRequests: true,
    },
  };

  describe('show appointment', () => {
    beforeEach(() => {
      mockFetch();
      mockFacilitiesApi({ response: [] });
      MockDate.set(getTestDate());
    });

    afterEach(() => {
      MockDate.reset();
    });

    // -------------

    it('should display who canceled the appointment', async () => {
      // Arrange
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.cancelled,
      });

      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response,
      });

      mockFacilityApi({
        id: '983',
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

      // CI-FIX: Wait for the h1 heading to be present first before checking focus.
      // On CI, async state updates may resolve at different timings.
      await screen.findByRole('heading', { level: 1 });
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });

      // The canceled appointment and past appointment alerts are mutually exclusive
      // with the canceled appointment status having 1st priority. So, the canceled
      // appointment alert should display even when the appointment is a past
      // appointment.
      expect(screen.queryByText(/Facility canceled this appointment/i));
      expect(screen.queryByText('This appointment occurred in the past.')).not
        .to.exist;
    });

    it('should display who canceled the appointment for past appointments', async () => {
      // Arrange
      const response = new MockAppointmentResponse({
        localStartTime: subDays(new Date(), 1),
        status: APPOINTMENT_STATUS.cancelled,
      });

      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response,
      });

      mockFacilityApi({
        id: '983',
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

      // Assert
      // CI-FIX: Wait for the h1 heading to be present first before checking focus.
      // On CI, async state updates may resolve at different timings.
      await screen.findByRole('heading', { level: 1 });
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });

      // The canceled appointment and past appointment alerts are mutually exclusive
      // with the canceled appointment status having 1st priority. So, the canceled
      // appointment alert should display even when the appointment is a past
      // appointment.
      expect(screen.queryByText(/Facility canceled this appointment/i));
      expect(screen.queryByText('This appointment occurred in the past.')).not
        .to.exist;
    });

    it('should allow the user to go back to the appointment list', async () => {
      // Arrange
      const response = new MockAppointmentResponse({ future: true });

      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response,
      });

      mockAppointmentsApi({
        end: addDays(new Date(), 395),
        start: subDays(new Date(), 30),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
        response: [response],
      });

      mockAppointmentsApi({
        end: addDays(new Date(), 1),
        start: subDays(new Date(), 120),
        statuses: ['proposed', 'cancelled'],
        response: [response],
      });

      mockFacilityApi({
        id: '983',
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

      // Assert
      // CI-FIX: Wait for the h1 heading to be present first before checking focus.
      // On CI, async state updates may resolve at different timings.
      await screen.findByRole('heading', { level: 1 });
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /In-person appointment/i,
        }),
      ).to.be.ok;

      userEvent.click(
        screen.container.querySelector('va-link[text="Back to appointments"]'),
      );
      expect(screen.baseElement).to.contain.text('Appointments');
    });

    describe('Document titles', () => {
      it('should display document title for ATLAS video appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createAtlasResponses({
          localStartTime: today,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment At An ATLAS Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for past ATLAS video appointment', async () => {
        // Arrange
        const yesterday = subDays(new Date(), 1);
        const responses = MockAppointmentResponse.createAtlasResponses({
          localStartTime: yesterday,
          past: true,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment At An ATLAS Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for canceled ATLAS video appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createAtlasResponses({
          localStartTime: today,
        });
        responses[0].setStatus(APPOINTMENT_STATUS.cancelled);

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment At An ATLAS Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for video appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createGfeResponses({
          localStartTime: today,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for past video appointment', async () => {
        // Arrange
        const yesterday = subDays(new Date(), 1);
        const responses = MockAppointmentResponse.createGfeResponses({
          localStartTime: yesterday,
          past: true,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for canceled video appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createGfeResponses({
          localStartTime: today,
        });
        responses[0].setStatus(APPOINTMENT_STATUS.cancelled);

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for video at VA location appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createClinicResponses({
          localStartTime: today,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment At A VA Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for past video at VA location appointment', async () => {
        // Arrange
        const yesterday = subDays(new Date(), 1);
        const responses = MockAppointmentResponse.createClinicResponses({
          localStartTime: yesterday,
          past: true,
        });

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment At A VA Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      it('should display document title for canceled video at VA location appointment', async () => {
        // Arrange
        const today = new Date();
        const responses = MockAppointmentResponse.createClinicResponses({
          localStartTime: today,
        });
        responses[0].setStatus(APPOINTMENT_STATUS.cancelled);

        mockAppointmentApi({
          includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
          response: responses[0],
        });

        mockFacilityApi({
          id: '983',
        });

        // Act
        const screen = renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        // CI-FIX: Wait for the h1 heading to be present first before checking title.
        await screen.findByRole('heading', { level: 1 });
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment At A VA Location On ${formatInTimeZone(
              responses[0].attributes.start,
              'America/Denver',
              DATE_FORMATS.friendlyWeekdayDate,
            )} | Veterans Affairs`,
          );
        });
      });

      describe('when appointment is canceled and in the past', () => {
        it('should display document title for canceled past phone appointment', async () => {
          // Arrange
          const yesterday = subDays(new Date(), 1);
          const responses = MockAppointmentResponse.createPhoneResponses({
            localStartTime: yesterday,
            past: true,
          });
          responses[0].setStatus(APPOINTMENT_STATUS.cancelled);

          mockAppointmentApi({
            includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
            response: responses[0],
          });

          mockFacilityApi({
            id: '983',
          });

          // Act
          const screen = renderWithStoreAndRouter(<AppointmentList />, {
            initialState,
            path: `/${responses[0].id}`,
          });

          // Assert
          // CI-FIX: Wait for the h1 heading to be present first before checking title.
          await screen.findByRole('heading', { level: 1 });
          await waitFor(() => {
            expect(global.document.title).to.equal(
              `Canceled Phone Appointment On ${formatInTimeZone(
                responses[0].attributes.start,
                'America/Denver',
                DATE_FORMATS.friendlyWeekdayDate,
              )} | Veterans Affairs`,
            );
          });
        });
        it('should display document title for canceled past CC appointment', async () => {
          // Arrange
          const yesterday = subDays(new Date(), 1);
          const responses = MockAppointmentResponse.createCCResponses({
            localStartTime: yesterday,
            past: true,
            status: APPOINTMENT_STATUS.cancelled,
          });

          mockAppointmentApi({
            includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
            response: responses[0],
          });

          mockFacilityApi({
            id: '983',
          });

          // Act
          const screen = renderWithStoreAndRouter(<AppointmentList />, {
            initialState,
            path: `/${responses[0].id}`,
          });

          // Assert
          // CI-FIX: Wait for the h1 heading to be present first before checking title.
          await screen.findByRole('heading', { level: 1 });
          await waitFor(() => {
            expect(global.document.title).to.equal(
              `Canceled Community Care Appointment On ${formatInTimeZone(
                responses[0].attributes.start,
                'America/Denver',
                DATE_FORMATS.friendlyWeekdayDate,
              )} | Veterans Affairs`,
            );
          });
        });
      });
    });
  });

  describe('display error', () => {
    it('should show error message when single fetch errors', async () => {
      // Arrange
      mockFetch();
      mockAppointmentApi({
        includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
        response: new MockAppointmentResponse(),
        responseCode: 404,
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: '/1',
      });

      // Assert
      // CI-FIX: Wait for the error heading to be present first, then verify focus.
      // On CI, async state updates may resolve faster. Waiting for the heading to
      // exist before checking focus ensures consistent behavior regardless of timing.
      const errorHeading = await screen.findByRole('heading', {
        level: 1,
        name: /We can.t access your appointment details right now/,
      });
      expect(errorHeading).to.be.ok;
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });
    });
  });
});
