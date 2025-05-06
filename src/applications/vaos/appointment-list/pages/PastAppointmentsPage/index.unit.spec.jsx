import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { within } from '@testing-library/dom';
import { expect } from 'chai';
import {
  addMinutes,
  format,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import PastAppointmentsList from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import {
  mockAppointmentsApi,
  mockFacilitiesApi,
} from '../../../tests/mocks/mockApis';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};
const now = startOfDay(new Date(), 'day');
const start = subMonths(now, 3);
const end = addMinutes(new Date(now).setMinutes(0), 30);

describe('VAOS Page: PastAppointmentsList api', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockFacilitiesApi({ response: [] });
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should show select date range dropdown', async () => {
    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    expect(
      await screen.container.querySelector('va-select[name="date-dropdown"]'),
    ).to.exist;
  });

  it('should update range on dropdown change', async () => {
    // Arrange
    const pastDate = subMonths(new Date(), 4);
    const response = new MockAppointmentResponse({
      localStartTime: pastDate,
      serviceType: null,
    });

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockAppointmentsApi({
      start: subMonths(now, 6),
      end: now,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findByText(/We didn’t find any results in this date range/i);

    const dropdown = await screen.findByTestId('vaosSelect');
    dropdown.__events.vaSelect({
      detail: { value: 1 },
    });

    // Assert
    await screen.findByText(new RegExp(format(pastDate, 'MMMM yyyy'), 'i'));
    await screen.findByText(/VA appointment/);
  });

  it('should show information without facility name', async () => {
    // Arrange
    const pastDate = subDays(new Date(), 3);
    const appointment = new MockAppointmentResponse({
      past: true,
      localStartTime: pastDate,
      serviceType: null,
      status: APPOINTMENT_STATUS.booked,
    }).setLocationId('983GC');

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(pastDate, 'EEEE, MMMM d'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    const timeHeader = within(firstCard).getAllByText(
      new RegExp(`^${format(pastDate, 'h:mm')}`, 'i'),
    )[0];

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(firstCard).not.to.contain.text('Canceled');
    expect(firstCard).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
  });

  it('should show information with facility name, useFeSourceOfTruthVA=false', async () => {
    // Arrange
    const pastDate = subDays(new Date(), 3);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [
        new MockAppointmentResponse({
          localStartTime: pastDate,
        }),
      ],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(pastDate, 'eeee, MMMM d'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(
        new RegExp(`^${format(pastDate, 'h:mm')}`, 'i'),
      ),
    ).to.exist;
    // TODO: Skipping until api call is made to get facility data on page load.
    // Currently, facility data is only retrieved when viewing appointment details
    // await waitFor(() => {
    //   expect(within(firstCard).getByText(/Cheyenne VA Medical Center/i)).to
    //     .exist;
    // });
    // expect(screen.baseElement).not.to.contain.text('VA appointment');
  });

  it('should show information with facility name, useFeSourceOfTruthVA=true', async () => {
    // Arrange
    const pastDate = subDays(new Date(), 3);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [new MockAppointmentResponse({ localStartTime: pastDate })],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(pastDate, 'eeee, MMMM d'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(
        new RegExp(`^${format(pastDate, 'h:mm')}`, 'i'),
      ),
    ).to.exist;
    // TODO: Skipping until api call is made to get facility data on page load.
    // Currently, facility data is only retrieved when viewing appointment details
    // await waitFor(() => {
    //   expect(within(firstCard).getByText(/Cheyenne VA Medical Center/i)).to
    //     .exist;
    // });
    // expect(screen.baseElement).not.to.contain.text('VA appointment');
  });

  it('should not display when over 2 years away', () => {
    // Arrange
    const pastDate = subYears(new Date(), 2);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [new MockAppointmentResponse({ localStartTime: pastDate })],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    return expect(screen.findByText(/We didn’t find any results/i)).to
      .eventually.be.ok;
  });

  it('should show expected video information', async () => {
    // Arrange
    const pastDate = subDays(new Date(), 3);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: MockAppointmentResponse.createGfeResponses({
        localStartTime: pastDate,
        past: true,
      }),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(pastDate, 'eeee, MMMM d'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Video');

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getAllByLabelText(
        new RegExp(format(pastDate, 'eeee, MMMM d'), 'i'),
      ),
    ).to.exist;

    expect(
      within(firstCard).getByText(
        new RegExp(`^${format(pastDate, 'h:mm')}`, 'i'),
      ),
    ).to.exist;

    expect(within(firstCard).getByText(/MT/i)).to.exist;
    expect(within(firstCard).getAllByLabelText(/Video appointment/i)).to.exist;
  });

  it('should display past appointments using V2 api call', async () => {
    // Arrange
    const yesterday = subDays(new Date(), 1);
    const facility = new MockFacilityResponse();
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
    });
    appointment.setLocation(facility);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [appointment],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(yesterday, 'eeee, MMMM d'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Details');
  });

  it('should display past cancel appt, vaOnlineSchedulingDisplayPastCancelledAppointments = true', async () => {
    // Arrange
    const yesterday = subDays(new Date(), 1);
    const facility = new MockFacilityResponse();
    const appointment = new MockAppointmentResponse({
      localStartTime: yesterday,
    });
    appointment.setLocation(facility);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [appointment],
    });

    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDisplayPastCancelledAppointments: true,
      },
    };

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState: myInitialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(format(yesterday, 'eeee, MMMM d'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Details');
  });
});
