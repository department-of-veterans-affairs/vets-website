import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { within } from '@testing-library/dom';
import { expect } from 'chai';
import {
  format,
  startOfDay,
  addDays,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import MockDate from 'mockdate';
import React from 'react';
import PastAppointmentsList from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import {
  mockAppointmentsApi,
  mockFacilitiesApi,
} from '../../../tests/mocks/mockApis';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
import { mockToday } from '../../../tests/mocks/constants';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};
const now = startOfDay(mockToday, 'day');
const start = subMonths(now, 3);
const end = addDays(new Date(now).setMinutes(0), 1);

describe('VAOS Page: PastAppointmentsList api', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(mockToday);
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
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findByText(/We didn’t find any results in this date range/i);

    expect(
      await screen.container.querySelector('va-select[name="date-dropdown"]'),
    ).to.exist;
  });

  it('should not show date range dropdown when loading indicator is present', async () => {
    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState: {
        ...initialState,
        appointments: {
          pastStatus: 'loading',
        },
      },
    });

    expect(screen.container.querySelector('va-loading-indicator')).to.exist;

    expect(screen.container.querySelector('va-select[name="date-dropdown"]'))
      .not.to.exist;
  });

  it('should update range on dropdown change', async () => {
    // Arrange
    const pastDate = subMonths(mockToday, 4);
    const response = new MockAppointmentResponse({
      localStartTime: pastDate,
      past: true,
    }).setTypeOfCare(null);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    mockAppointmentsApi({
      start: subMonths(now, 6),
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
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
    const pastDate = subDays(mockToday, 3);
    const response = new MockAppointmentResponse({
      past: true,
      localStartTime: pastDate,
    })
      .setLocationId('983GC')
      .setTypeOfCare(null);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(
          response.attributes.start,
          'America/Denver',
          'EEEE, MMMM d',
        ),
        'i',
      ),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    const timeHeader = within(firstCard).getAllByText(
      new RegExp(
        `^${formatInTimeZone(
          response.attributes.start,
          'America/Denver',
          'h:mm',
        )}`,
        'i',
      ),
    )[0];

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(firstCard).not.to.contain.text('Canceled');
    expect(firstCard).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
  });

  it('should show information with facility name', async () => {
    // Arrange
    const pastDate = subDays(mockToday, 3);
    const response = new MockAppointmentResponse({
      localStartTime: pastDate,
      past: true,
    }).setLocation(new MockFacilityResponse());

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(
          response.attributes.start,
          'America/Denver',
          'eeee, MMMM d',
        ),
        'i',
      ),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(
        new RegExp(
          `^${formatInTimeZone(
            response.attributes.start,
            'America/Denver',
            'h:mm',
          )}`,
          'i',
        ),
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
    const pastDate = subYears(mockToday, 2);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: [
        new MockAppointmentResponse({ localStartTime: pastDate, past: true }),
      ],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
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
    const pastDate = subDays(mockToday, 3);
    const responses = MockAppointmentResponse.createGfeResponses({
      localStartTime: pastDate,
      past: true,
    });
    responses[0].setLocation(new MockFacilityResponse());
    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      response: responses,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(
          responses[0].attributes.start,
          'America/Denver',
          'eeee, MMMM d',
        ),
        'i',
      ),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Video');

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getAllByLabelText(
        new RegExp(
          formatInTimeZone(
            responses[0].attributes.start,
            'America/Denver',
            'eeee, MMMM d',
          ),
          'i',
        ),
      ),
    ).to.exist;
    expect(
      within(firstCard).getByText(
        new RegExp(
          `^${formatInTimeZone(
            responses[0].attributes.start,
            'America/Denver',
            'h:mm',
          )}`,
          'i',
        ),
      ),
    ).to.exist;

    expect(within(firstCard).getByText(/MT/i)).to.exist;
    expect(within(firstCard).getByText(/Video/i)).to.exist;
  });

  it('should display past appointments using V2 api call', async () => {
    // Arrange
    const yesterday = subDays(mockToday, 1);
    const facility = new MockFacilityResponse();
    const response = new MockAppointmentResponse({
      localStartTime: yesterday,
      past: true,
    });
    response.setLocation(facility);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      response: [response],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(
          response.attributes.start,
          'America/Denver',
          'eeee, MMMM d',
        ),
        'i',
      ),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Details');
  });

  it('should display past cancel appt', async () => {
    // Arrange
    const yesterday = subDays(mockToday, 1);
    const facility = new MockFacilityResponse();
    const response = new MockAppointmentResponse({
      localStartTime: yesterday,
      past: true,
      status: APPOINTMENT_STATUS.cancelled,
    });
    response.setLocation(facility);

    mockAppointmentsApi({
      start,
      end,
      includes: ['facilities', 'clinics', 'avs', 'travel_pay_claims'],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      response: [response],
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findAllByLabelText(
      new RegExp(
        formatInTimeZone(
          response.attributes.start,
          'America/Denver',
          'eeee, MMMM d',
        ),
        'i',
      ),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Details');
  });
});
