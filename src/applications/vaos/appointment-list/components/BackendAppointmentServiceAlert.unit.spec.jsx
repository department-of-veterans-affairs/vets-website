import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import { addDays, startOfDay, subDays, subMonths } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import { AppointmentList } from '..';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import { mockAppointmentsApi } from '../../tests/mocks/mockApis';
import { getTestDate, renderWithStoreAndRouter } from '../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import PastAppointmentsPage from '../pages/PastAppointmentsPage';
import RequestedAppointmentsPage from '../pages/RequestedAppointmentsPage/RequestedAppointmentsPage';

describe('VAOS Backend Service Alert', () => {
  const now = startOfDay(new Date());
  const yesterday = subDays(now, 1);
  const initialState = {};

  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should display BackendAppointmentServiceAlert if there is a failure returned on the upcoming appointments list', async () => {
    // Arrange
    const start = subDays(now, 30);
    const end = addDays(now, 395);
    const appointment = new MockAppointmentResponse({
      localStartTime: addDays(now, 1),
      status: APPOINTMENT_STATUS.booked,
      future: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 1),
      response: [appointment],
      statuses: ['proposed', 'cancelled'],
    });
    mockAppointmentsApi({
      start,
      end,
      response: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      backendServiceFailures: true,
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(`Appointments | Veterans Affairs`);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there is no failure returned the upcoming appointments list', async () => {
    // Arrange
    const start = subDays(now, 30);
    const end = addDays(now, 395);
    const appointment = new MockAppointmentResponse({
      localStartTime: addDays(now, 1),
      status: APPOINTMENT_STATUS.booked,
    });

    mockAppointmentsApi({
      start,
      end,
      response: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: now,
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(`Appointments | Veterans Affairs`);
    });

    expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
      .exist;
  });

  it('should not display BackendAppointmentServiceAlert if there is no failure returned on the past appointments list', async () => {
    // Arrange
    const start = subMonths(now, 3);
    const end = addDays(now.setMinutes(0), 1);
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.booked,
      past: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [appointment],
      start,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsPage />, {
      initialState,
    });

    // Assert
    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there is no failure returned on the past appointments list', async () => {
    // Arrange
    const start = subMonths(now, 3);
    const end = addDays(now.setMinutes(0), 1);
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.booked,
      past: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [appointment],
      start,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsPage />, {
      initialState,
    });

    // Assert
    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
        .exist;
    });
  });

  it('should display BackendAppointmentServiceAlert if there is a failure returned on the pending appointments list', async () => {
    // Arrange
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
      backendServiceFailures: true,
    });

    // Act
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsPage />,
      initialState,
    );

    // Assert
    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to
        .exist;
    });
  });

  it('should not display BackendAppointmentServiceAlert if there no failure returned on the pending appointments list', async () => {
    // Arrange
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
      backendServiceFailures: false,
    });

    // Act
    const screen = renderWithStoreAndRouter(
      <RequestedAppointmentsPage />,
      initialState,
    );

    // Assert
    await waitFor(() => {
      expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('backend-appointment-service-alert')).to.not
        .exist;
    });
  });
});
