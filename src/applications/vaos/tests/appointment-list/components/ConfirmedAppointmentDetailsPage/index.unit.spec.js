import React from 'react';
import { expect } from 'chai';
import moment from 'moment-timezone';
import MockDate from 'mockdate';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import { renderWithStoreAndRouter, getTestDate } from '../../../mocks/setup';

import { AppointmentList } from '../../../../appointment-list';
import {
  mockAppointmentApi,
  mockGetPendingAppointmentsApi,
  mockGetUpcomingAppointmentsApi,
} from '../../../mocks/helpers';
import { mockFacilitiesFetch } from '../../../mocks/fetch';
import MockAppointmentResponse from '../../../e2e/fixtures/MockAppointmentResponse';

describe('VAOS Page: ConfirmedAppointmentDetailsPage with VAOS service', () => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      show_new_schedule_view_appointments_page: true,
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingPast: true,
      vaOnlineSchedulingRequests: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
    },
  };

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
    expect(screen.queryByText('This appointment occurred in the past.')).not.to
      .exist;
  });

  it('should display who canceled the appointment for past appointments', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      localStartTime: moment().subtract(1, 'day'),
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
    expect(screen.queryByText('This appointment occurred in the past.')).not.to
      .exist;
  });

  it('should show error message when single fetch errors', async () => {
    // Arrange
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

  it('should allow the user to go back to the appointment list', async () => {
    // Arrange
    const response = new MockAppointmentResponse();

    mockAppointmentApi({ response, avs: true });
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

    userEvent.click(screen.getByText(/Back to appointments/i));
    expect(screen.baseElement).to.contain.text('Appointments');
  });

  describe('Document titles', () => {
    it('should display document tile for ATLAS video appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createAtlasResponses({
        localStartTime: today,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Video appointment at an ATLAS location on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for past ATLAS video appointment', async () => {
      // Arrange
      const yesterday = moment().subtract(1, 'day');
      const responses = MockAppointmentResponse.createAtlasResponses({
        localStartTime: yesterday,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Past video appointment at an ATLAS location on ${yesterday.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for canceled ATLAS video appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createAtlasResponses({
        localStartTime: today,
      });
      responses[0].setStatus(APPOINTMENT_STATUS.cancelled);
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Canceled video appointment at an ATLAS location on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for video appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createGfeResponses({
        localStartTime: today,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Video appointment on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for past video appointment', async () => {
      // Arrange
      const yesterday = moment().subtract(1, 'day');
      const responses = MockAppointmentResponse.createGfeResponses({
        localStartTime: yesterday,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Past video appointment on ${yesterday.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for canceled video appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createGfeResponses({
        localStartTime: today,
      });
      responses[0].setStatus(APPOINTMENT_STATUS.cancelled);
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Canceled video appointment on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for video at VA location appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: today,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Video appointment at a VA location on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for past video at VA location appointment', async () => {
      // Arrange
      const yesterday = moment().subtract(1, 'day');
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: yesterday,
      });
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Past video appointment at a VA location on ${yesterday.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });

    it('should display document tile for canceled video at VA location appointment', async () => {
      // Arrange
      const today = moment();
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: today,
      });
      responses[0].setStatus(APPOINTMENT_STATUS.cancelled);
      mockAppointmentApi({ response: responses[0], avs: true });

      // Act
      renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: `/${responses[0].id}`,
      });

      // Assert
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Canceled video appointment at a VA location on ${today.format(
            'dddd, MMMM D, YYYY',
          )} | Veterans Affairs`,
        );
      });
    });
  });
});
