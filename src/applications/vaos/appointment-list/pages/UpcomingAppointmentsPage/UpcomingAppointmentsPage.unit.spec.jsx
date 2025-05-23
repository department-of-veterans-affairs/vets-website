import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import { addDays, format, subDays } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import reducers from '../../../redux/reducer';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { mockAppointmentsApi } from '../../../tests/mocks/mockApis';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import UpcomingAppointmentsPage from './UpcomingAppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS Component: UpcomingAppointmentsList', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });
  const now = new Date();
  const start = subDays(now, 30); // Subtract 30 days
  const end = addDays(now, 395); // Add 395 days

  it('should show VA appointment text, useFeSourceOfTruthVA=false', async () => {
    // Arrange
    const appointment = new MockAppointmentResponse({
      localStartTime: now,
    })
      .setLocation(new MockFacilityResponse())
      .setTypeOfCare(null);

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  it('should show VA appointment text, useFeSourceOfTruthVA=true', async () => {
    // Arrange
    const appointment = new MockAppointmentResponse({
      localStartTime: now,
    })
      .setLocation(new MockFacilityResponse())
      .setTypeOfCare(null);

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingFeSourceOfTruthVA: true,
        },
      },
      reducers,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  it('should show CC appointment text', async () => {
    // Arrange
    const appointments = MockAppointmentResponse.createCCResponses({
      localStartTime: now,
      status: APPOINTMENT_STATUS.booked,
    });

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: appointments,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Community care');
  });

  it('should show at home video appointment text', async () => {
    // Arrange
    const appointments = MockAppointmentResponse.createGfeResponses({
      localStartTime: now,
    });

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: appointments,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Video');
  });

  it('should show phone appointment text', async () => {
    // Arrange
    const appointments = MockAppointmentResponse.createPhoneResponses({
      localStartTime: now,
    });

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: appointments,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );

    expect(screen.baseElement).to.contain.text('Phone');
  });

  it('should show cancelled appointment text', async () => {
    const appointments = MockAppointmentResponse.createCCResponses({
      localStartTime: now,
      status: APPOINTMENT_STATUS.cancelled,
    });

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: appointments,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    await screen.findAllByLabelText(
      new RegExp(format(now, 'EEEE, MMMM d'), 'i'), // Format as 'Day, Month Date'
    );

    expect(screen.findAllByLabelText(/canceled Community care/i));
    expect(screen.baseElement).to.contain.text('Community care');
  });
  it('should show VA appointment text for telehealth appointments without vvsKind', async () => {
    const appointments = MockAppointmentResponse.createVAResponses({
      localStartTime: now,
    });
    appointments[0]
      .setLocation(new MockFacilityResponse())
      .setTypeOfCare(null)
      .setVvsKind(null);

    mockAppointmentsApi({
      start: subDays(now, 120), // Subtract 120 days
      end: addDays(now, 1), // Current date + 1
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    mockAppointmentsApi({
      start,
      end,
      response: appointments,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    await screen.findAllByText('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });
});
