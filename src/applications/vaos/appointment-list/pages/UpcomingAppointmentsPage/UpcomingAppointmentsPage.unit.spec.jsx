import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import { addDays, format, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import React from 'react';
import reducers from '../../../redux/reducer';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { mockAppointmentsApi } from '../../../tests/mocks/mockApis';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
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
  });
  afterEach(() => {});
  const now = new Date();
  const start = subDays(now, 30); // Subtract 30 days
  const end = addDays(now, 395); // Add 395 days

  it('should show VA appointment text', async () => {
    // Arrange
    const appointment = new MockAppointmentResponse({
      localStartTime: now,
      future: true,
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
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState: {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
        },
      },
      reducers,
    });

    // Assert
    // Using date string here since we don't want the timezone coversion twice.
    // Notice the 'Z' is appended to the current local time. This is saying, use
    // local time as UTC time when we call 'formatInTimeZone'.
    const utcString = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(utcString, 'America/Denver', 'EEEE, MMMM d'),
        'i',
      ), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  it('should show CC appointment text', async () => {
    // Arrange
    const responses = MockAppointmentResponse.createCCResponses({
      localStartTime: now,
      status: APPOINTMENT_STATUS.booked,
      future: true,
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
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    const utcString = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(utcString, 'America/Denver', 'EEEE, MMMM d'),
        'i',
      ), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Community care');
  });

  it('should show at home video appointment text', async () => {
    // Arrange
    const responses = MockAppointmentResponse.createGfeResponses({
      localStartTime: now,
      future: true,
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
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    const utcString = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(utcString, 'America/Denver', 'EEEE, MMMM d'),
        'i',
      ), // Format as 'Day, Month Date'
    );
    expect(screen.baseElement).to.contain.text('Video');
  });

  it('should show phone appointment text', async () => {
    // Arrange
    const responses = MockAppointmentResponse.createPhoneResponses({
      localStartTime: now,
      future: true,
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
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    // Assert
    const utcString = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(utcString, 'America/Denver', 'EEEE, MMMM d'),
        'i',
      ), // Format as 'Day, Month Date'
    );

    expect(screen.baseElement).to.contain.text('Phone');
  });

  it('should show cancelled appointment text', async () => {
    const responses = MockAppointmentResponse.createCCResponses({
      localStartTime: now,
      status: APPOINTMENT_STATUS.cancelled,
      future: true,
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
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    const utcString = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(utcString, 'America/Denver', 'EEEE, MMMM d'),
        'i',
      ), // Format as 'Day, Month Date'
    );

    expect(screen.findAllByLabelText(/canceled Community care/i));
    expect(screen.baseElement).to.contain.text('Community care');
  });
  it('should show VA appointment text for telehealth appointments without vvsKind', async () => {
    const responses = MockAppointmentResponse.createVAResponses({
      localStartTime: now,
      future: true,
    });
    responses[0]
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
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    const screen = renderWithStoreAndRouter(<UpcomingAppointmentsPage />, {
      initialState,
      reducers,
    });

    await screen.findAllByText('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });
});
