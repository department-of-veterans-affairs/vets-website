import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { within } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import PastAppointmentsList, {
  getPastAppointmentDateRangeOptions,
} from '../../../appointment-list/components/PastAppointmentsList';
import { getVAOSAppointmentMock } from '../../mocks/v2';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../mocks/data';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';
import MockAppointmentResponse from '../../e2e/fixtures/MockAppointmentResponse';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingVAOSServiceVAAppointments: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
  },
};

const testDates = () => {
  const now = moment().startOf('day');
  const start = moment(now).subtract(3, 'months');
  const end = moment(now)
    .minutes(0)
    .add(30, 'minutes');

  return {
    now,
    start,
    end,
  };
};

describe('VAOS Page: PastAppointmentsList V2 api', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockFacilitiesFetchByVersion({ version: 0 });
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should show select date range dropdown', async () => {
    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
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
    const pastDate = moment(testDates().now).subtract(3, 'months');
    const response = new MockAppointmentResponse({
      localStartTime: pastDate,
      serviceType: null,
    });

    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });
    mockVAOSAppointmentsFetch({
      start: testDates()
        .now.subtract(5, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      end: testDates()
        .end.subtract(3, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
      requests: [response],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
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
    await screen.findByText(new RegExp(pastDate.format('MMMM YYYY'), 'i'));
    await screen.findByText(/VA appointment/);
  });

  it('should show information without facility name', async () => {
    const pastDate = moment(testDates().now).subtract(3, 'days');

    const data = {
      id: '1234',
      kind: 'clinic',
      clinic: 'fake',
      localStartTime: pastDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: pastDate.format(),
      locationId: '983GC',
      status: 'booked',
    };
    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findAllByLabelText(
      new RegExp(pastDate.format('dddd, MMMM D'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    const timeHeader = within(firstCard).getAllByText(
      new RegExp(pastDate.format('h:mm'), 'i'),
    )[0];

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(firstCard).not.to.contain.text('Canceled');
    expect(firstCard).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
  });

  it('should show information with facility name', async () => {
    const pastDate = moment(testDates().now).subtract(3, 'days');

    const data = {
      id: '1234',
      currentStatus: 'CHECKED OUT',
      kind: 'clinic',
      clinic: 'fake',
      localStartTime: pastDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: pastDate.format(),
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
    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    // TODO: Figure out which to use, 'createMockFacilityByVersion' or
    // 'getVAOSAppointmentMock' and update attributes to reflect current api.
    // Ideally, the created mock appointment should contain the required attributes
    // needed to display a page with other attributes added as needed.
    const facility = createMockFacilityByVersion({
      id: '442GC',
      name: 'Cheyenne VA Medical Center',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
      phone: '307-778-7550',
      version: 0,
    });
    mockFacilitiesFetchByVersion({ facilities: [facility], version: 0 });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findAllByLabelText(
      new RegExp(pastDate.format('dddd, MMMM D'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(new RegExp(pastDate.format('h:mm'), 'i')),
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
    const pastDate = moment(testDates().now).subtract(2, 'years');

    const data = {
      id: '1234',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: 'fake',
      start: pastDate.format(),
      locationId: '983GC',
      status: 'booked',
    };
    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    return expect(screen.findByText(/You don’t have any past appointments/i)).to
      .eventually.be.ok;
  });

  it('should show expected video information', async () => {
    const pastDate = moment(testDates().now).subtract(3, 'days');

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1';
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: null,
      facilityId: '983',
      kind: 'telehealth',
      locationId: '983',
      localStartTime: pastDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: pastDate.format(),
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
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await screen.findAllByLabelText(
      new RegExp(pastDate.format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Video');

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getAllByLabelText(
        new RegExp(pastDate.format('dddd, MMMM D'), 'i'),
      ),
    ).to.exist;

    expect(
      within(firstCard).getByText(new RegExp(pastDate.format('h:mm'), 'i')),
    ).to.exist;

    expect(within(firstCard).getByText(/MT/i)).to.exist;
    expect(within(firstCard).getAllByLabelText(/Video appointment/i)).to.exist;
  });

  it('should display past appointments using V2 api call', async () => {
    const yesterday = moment(testDates().now)
      .utc()
      .subtract(1, 'day');

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1';
    appointment.attributes = {
      ...appointment.attributes,
      minutesDuration: 30,
      status: 'booked',
      localStartTime: yesterday.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: yesterday.format(),
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
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const myInitialState = {
      ...initialState,
    };
    const screen = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState: myInitialState,
    });

    await screen.findAllByLabelText(
      new RegExp(yesterday.format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
  });

  describe('getPastAppointmentDateRangeOptions', () => {
    const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));
    it('should return 6 correct date ranges for dropdown', () => {
      expect(ranges.length).to.equal(6);

      expect(ranges[0].value).to.equal(0);
      expect(ranges[0].label).to.equal('Past 3 months');
      expect(ranges[0].startDate).to.include('2019-11-02');
      expect(ranges[0].endDate).to.include('2020-02-02');

      expect(ranges[1].value).to.equal(1);
      expect(ranges[1].label).to.equal('Sept. 2019 – Nov. 2019');
      expect(ranges[1].startDate).to.include('2019-09-01');
      expect(ranges[1].endDate).to.include('2019-11-30');

      expect(ranges[2].value).to.equal(2);
      expect(ranges[2].label).to.equal('June 2019 – Aug. 2019');
      expect(ranges[2].startDate).to.include('2019-06-01');
      expect(ranges[2].endDate).to.include('2019-08-31');

      expect(ranges[3].value).to.equal(3);
      expect(ranges[3].label).to.equal('March 2019 – May 2019');
      expect(ranges[3].startDate).to.include('2019-03-01');
      expect(ranges[3].endDate).to.include('2019-05-31');

      expect(ranges[4].value).to.equal(4);
      expect(ranges[4].label).to.equal('All of 2020');
      expect(ranges[4].startDate).to.include('2020-01-01');
      expect(ranges[4].endDate).to.include('2020-02-02');

      expect(ranges[5].value).to.equal(5);
      expect(ranges[5].label).to.equal('All of 2019');
      expect(ranges[5].startDate).to.include('2019-01-01');
      expect(ranges[5].endDate).to.include('2019-12-31');
    });
  });
});
