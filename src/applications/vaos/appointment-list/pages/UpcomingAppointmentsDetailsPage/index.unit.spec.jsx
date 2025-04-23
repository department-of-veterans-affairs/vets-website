import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';
import { format, subDays } from 'date-fns';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

import { AppointmentList } from '../..';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import { mockFacilitiesFetch } from '../../../tests/mocks/fetch';
import {
  mockAppointmentApi,
  mockGetPendingAppointmentsApi,
  mockGetUpcomingAppointmentsApi,
} from '../../../tests/mocks/helpers';

describe('VAOS Page: ConfirmedAppointmentDetailsPage with VAOS service', () => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      show_new_schedule_view_appointments_page: true,
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingPast: true,
      vaOnlineSchedulingRequests: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
    },
  };

  describe('show appointment', () => {
    beforeEach(() => {
      mockFetch();
      mockFacilitiesFetch();
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
      mockAppointmentApi({ response });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

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

      mockAppointmentApi({ response });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

      // Assert
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

      mockAppointmentApi({ response, avs: true, fetchClaimStatus: true });
      mockGetUpcomingAppointmentsApi({
        response: [response],
        avs: true,
      });
      mockGetPendingAppointmentsApi({
        response: [response],
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${response.id}`,
      });

      // Assert
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');
      });

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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment At An ATLAS Location On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment At An ATLAS Location On ${format(
              yesterday,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment At An ATLAS Location On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment On ${format(
              yesterday,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Upcoming Video Appointment At A VA Location On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Past Video Appointment At A VA Location On ${format(
              yesterday,
              'EEEE, MMMM d, yyyy',
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
          response: responses[0],
          avs: true,
          fetchClaimStatus: true,
        });

        // Act
        renderWithStoreAndRouter(<AppointmentList />, {
          initialState,
          path: `/${responses[0].id}`,
        });

        // Assert
        await waitFor(() => {
          expect(global.document.title).to.equal(
            `Canceled Video Appointment At A VA Location On ${format(
              today,
              'EEEE, MMMM d, yyyy',
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
            response: responses[0],
            avs: true,
            fetchClaimStatus: true,
          });

          // Act
          renderWithStoreAndRouter(<AppointmentList />, {
            initialState,
            path: `/${responses[0].id}`,
          });

          // Assert
          await waitFor(() => {
            expect(global.document.title).to.equal(
              `Canceled Phone Appointment On ${format(
                yesterday,
                'EEEE, MMMM d, yyyy',
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
          });
          responses[0].setStatus(APPOINTMENT_STATUS.cancelled);
          mockAppointmentApi({
            response: responses[0],
            avs: true,
            fetchClaimStatus: true,
          });

          // Act
          renderWithStoreAndRouter(<AppointmentList />, {
            initialState,
            path: `/${responses[0].id}`,
          });

          // Assert
          await waitFor(() => {
            expect(global.document.title).to.equal(
              `Canceled Community Care Appointment On ${format(
                yesterday,
                'EEEE, MMMM d, yyyy',
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
        response: new MockAppointmentResponse(),
        responseCode: 404,
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: '/1',
      });

      // Assert
      await waitFor(() => {
        expect(document.activeElement).to.have.tagName('h1');

        expect(
          screen.getByRole('heading', {
            level: 1,
            name: 'We’re sorry. We’ve run into a problem',
          }),
        ).to.be.ok;
      });
    });
  });
});
