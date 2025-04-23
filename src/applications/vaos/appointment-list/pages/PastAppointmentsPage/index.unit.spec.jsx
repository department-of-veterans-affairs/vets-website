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
import { createMockAppointment } from '../../../tests/mocks/data';
import { getVAOSAppointmentMock } from '../../../tests/mocks/mock';
import {
  mockFacilitiesApi,
  mockVAOSAppointmentsFetch,
} from '../../../tests/mocks/mockApis';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingVAOSServiceVAAppointments: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
  },
};
const now = startOfDay(new Date(), 'day');
const start = format(subMonths(now, 3), 'yyyy-MM-dd');
const end = format(addMinutes(new Date(now).setMinutes(0), 30), 'yyyy-MM-dd');

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
    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const { findByText } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    expect(await findByText(/Past 3 months/i)).to.exist;
  });

  it('should update range on dropdown change', async () => {
    // Arrange
    const pastDate = subMonths(new Date(), 4);
    const response = new MockAppointmentResponse({
      localStartTime: pastDate,
      serviceType: null,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
    });

    mockVAOSAppointmentsFetch({
      start: format(subMonths(now, 6), 'yyyy-MM-dd'),
      end: format(now, 'yyyy-MM-dd'),
      requests: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findByText(/You don’t have any past appointments/i);

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

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
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
    const data = {
      id: '1234',
      currentStatus: 'CHECKED OUT',
      kind: 'clinic',
      clinic: 'fake',
      localStartTime: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss.000xx"),
      start: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss"),
      locationId: '983GC',
      status: 'fulfilled',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          type: 'va_facilities',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          timezone: {
            timeZoneId: 'America/Denver',
          },
          lat: 39.744507,
          long: -104.830956,
          website: 'https://www.denver.va.gov/locations/directions.asp',
          phone: {
            main: '307-778-7550',
            fax: '307-778-7381',
            pharmacy: '866-420-6337',
            afterHours: '307-778-7550',
            patientAdvocate: '307-778-7550 x7517',
            mentalHealthClinic: '307-778-7349',
            enrollmentCoordinator: '307-778-7550 x7579',
          },
          physicalAddress: {
            type: 'physical',
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          mobile: false,
          healthService: [],
          operatingStatus: {
            code: 'NORMAL',
          },
        },
      },
    };
    const appointment = createMockAppointment({
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
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
    const data = {
      id: '1234',
      currentStatus: 'CHECKED OUT',
      kind: 'clinic',
      type: 'VA',
      clinic: 'fake',
      localStartTime: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss.000xx"),
      start: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss"),
      locationId: '983GC',
      status: 'fulfilled',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          type: 'va_facilities',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          timezone: {
            timeZoneId: 'America/Denver',
          },
          lat: 39.744507,
          long: -104.830956,
          website: 'https://www.denver.va.gov/locations/directions.asp',
          phone: {
            main: '307-778-7550',
            fax: '307-778-7381',
            pharmacy: '866-420-6337',
            afterHours: '307-778-7550',
            patientAdvocate: '307-778-7550 x7517',
            mentalHealthClinic: '307-778-7349',
            enrollmentCoordinator: '307-778-7550 x7579',
          },
          physicalAddress: {
            type: 'physical',
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          mobile: false,
          healthService: [],
          operatingStatus: {
            code: 'NORMAL',
          },
        },
      },
    };
    const appointment = createMockAppointment({
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
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
    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: 'fake',
      start: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss"),
      locationId: '983GC',
      status: 'booked',
    };
    const appointment = createMockAppointment({
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
    });

    // Act
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    // Assert
    return expect(screen.findByText(/You don’t have any past appointments/i)).to
      .eventually.be.ok;
  });

  it('should show expected video information', async () => {
    // Arrange
    const pastDate = subDays(new Date(), 3);
    const appointment = getVAOSAppointmentMock();
    appointment.id = '1';
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: null,
      facilityId: '983',
      kind: 'telehealth',
      type: 'VA',
      locationId: '983',
      localStartTime: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss.000xx"),
      start: format(pastDate, "yyyy-MM-dd'T'HH:mm:ss"),
      status: 'booked',
      extention: {
        patientHasMobileGfe: false,
      },
      telehealth: {
        atlas: null,
        url:
          'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VAC00064b6f@care2.evn.va.gov&pin=4569928835#',
        vvsKind: 'ADHOC',
      },
    };

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      avs: true,
      fetchClaimStatus: true,
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
    const appointment = getVAOSAppointmentMock();
    appointment.id = '1';
    appointment.attributes = {
      ...appointment.attributes,
      type: 'VA',
      minutesDuration: 30,
      status: 'booked',
      localStartTime: format(yesterday, "yyyy-MM-dd'T'HH:mm:ss.000xx"),
      start: format(yesterday, "yyyy-MM-dd'T'HH:mm:ss"),
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
    };
    mockVAOSAppointmentsFetch({
      start,
      end,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [appointment],
      avs: true,
      fetchClaimStatus: true,
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
    const appointment = getVAOSAppointmentMock();
    appointment.id = '1';
    appointment.attributes = {
      ...appointment.attributes,
      type: 'VA',
      minutesDuration: 30,
      status: 'cancelled',
      localStartTime: format(yesterday, "yyyy-MM-dd'T'HH:mm:ss.000xx"),
      start: format(yesterday, "yyyy-MM-dd'T'HH:mm:ss"),
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
    };
    mockVAOSAppointmentsFetch({
      start,
      end,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [appointment],
      avs: true,
      fetchClaimStatus: true,
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
