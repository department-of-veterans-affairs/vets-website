import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { within, waitFor } from '@testing-library/dom';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getVARequestMock,
  getVideoAppointmentMock,
} from '../../mocks/v0';
import {
  mockFacilitiesFetch,
  mockPastAppointmentInfo,
  mockPastAppointmentInfoOption1,
} from '../../mocks/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import PastAppointmentsListV2, {
  getPastAppointmentDateRangeOptions,
} from '../../../appointment-list/components/PastAppointmentsListV2';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <PastAppointmentsListV2>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });
  it('should show select date range dropdown', async () => {
    mockPastAppointmentInfo({ va: [] });

    const { findByText } = renderWithStoreAndRouter(
      <PastAppointmentsListV2 />,
      {
        initialState,
      },
    );

    expect(await findByText(/Past 3 months/i)).to.exist;
  });

  it('should update range on dropdown change', async () => {
    const pastDate = moment().subtract(3, 'months');
    const rangeLabel = `${moment()
      .subtract(3, 'months')
      .startOf('month')
      .format('MMMM YYYY')}`;
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'Some clinic',
      facilityId: '983',
      sta6aid: '983GC',
    };

    mockPastAppointmentInfo({ va: [] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findByText(/You don’t have any appointments/i);

    mockPastAppointmentInfoOption1({ va: [appointment] });

    fireEvent.change(screen.getByLabelText(/select a date range/i), {
      target: { value: 1 },
    });

    fireEvent.click(screen.queryByText('Update'));

    await screen.findByText(new RegExp(pastDate.format('MMMM YYYY'), 'i'));

    expect(screen.baseElement).to.contain.text(`Appointments in ${rangeLabel}`);
    expect(screen.baseElement).to.contain.text('VA appointment');
    expect(screen.baseElement).to.contain.text('Details');
  });

  it('should show information without facility name', async () => {
    const pastDate = moment().subtract(3, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockPastAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(pastDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    const timeHeader = within(firstCard).getAllByText(
      new RegExp(pastDate.tz('America/Denver').format('h:mm'), 'i'),
    )[0];

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(firstCard).not.to.contain.text('Canceled');
    expect(firstCard).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should show information with facility name', async () => {
    const pastDate = moment().subtract(3, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
    mockPastAppointmentInfo({ va: [appointment] });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(pastDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(
        new RegExp(pastDate.tz('America/Denver').format('h:mm'), 'i'),
      ),
    ).to.exist;
    await waitFor(() => {
      expect(within(firstCard).getByText(/Cheyenne VA Medical Center/i)).to
        .exist;
    });
    expect(screen.baseElement).not.to.contain.text('VA appointment');
  });

  it('should have correct status when previously cancelled', async () => {
    const pastDate = moment().subtract(3, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';

    mockPastAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(pastDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should not display when they have hidden statuses', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'NO-SHOW';

    mockPastAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
  });

  it('should not display when over 13 months away', () => {
    const pastDate = moment().subtract(14, 'months');
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = pastDate.format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockPastAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    return expect(screen.findByText(/You don’t have any appointments/i)).to
      .eventually.be.ok;
  });

  it('should show expected video information', async () => {
    const pastDate = moment().subtract(3, 'days');
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: pastDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: pastDate.format(),
      bookingNotes: 'Bring face mask',
      status: { description: 'C', code: 'CHECKED OUT' },
    };
    mockPastAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(pastDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('VA Video Connect');

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(
      within(firstCard).getByText(
        new RegExp(pastDate.tz('America/Denver').format('dddd, MMMM D'), 'i'),
      ),
    ).to.exist;

    expect(
      within(firstCard).getByText(
        new RegExp(pastDate.tz('America/Denver').format('h:mm'), 'i'),
      ),
    ).to.exist;
    expect(within(firstCard).getByText(/MT/i)).to.exist;
    expect(within(firstCard).getByText(/VA Video Connect at home/i)).to.exist;
  });

  describe('getPastAppointmentDateRangeOptions', () => {
    const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));
    it('should return 6 correct date ranges for dropdown', () => {
      expect(ranges.length).to.equal(6);

      expect(ranges[0].value).to.equal(0);
      expect(ranges[0].label).to.equal('Past 3 months');
      expect(ranges[0].startDate).to.include('2019-11-02T00:00:00');
      expect(ranges[0].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[1].value).to.equal(1);
      expect(ranges[1].label).to.equal('Sept. 2019 – Nov. 2019');
      expect(ranges[1].startDate).to.include('2019-09-01T00:00:00');
      expect(ranges[1].endDate).to.include('2019-11-30T23:59:59');

      expect(ranges[2].value).to.equal(2);
      expect(ranges[2].label).to.equal('June 2019 – Aug. 2019');
      expect(ranges[2].startDate).to.include('2019-06-01T00:00:00');
      expect(ranges[2].endDate).to.include('2019-08-31T23:59:59');

      expect(ranges[3].value).to.equal(3);
      expect(ranges[3].label).to.equal('March 2019 – May 2019');
      expect(ranges[3].startDate).to.include('2019-03-01T00:00:00');
      expect(ranges[3].endDate).to.include('2019-05-31T23:59:59');

      expect(ranges[4].value).to.equal(4);
      expect(ranges[4].label).to.equal('All of 2020');
      expect(ranges[4].startDate).to.include('2020-01-01T00:00:00');
      expect(ranges[4].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[5].value).to.equal(5);
      expect(ranges[5].label).to.equal('All of 2019');
      expect(ranges[5].startDate).to.include('2019-01-01T00:00:00');
      expect(ranges[5].endDate).to.include('2019-12-31T23:59:59');
    });
  });

  it('should include fulfilled Express Care requests', async () => {
    const startDate = moment();
    const request = getVARequestMock();
    request.attributes = {
      ...request.attributes,
      status: 'Resolved',
      optionDate1: startDate.format('MM/DD/YYYY'),
      optionTime1: 'AM',
      date: startDate.format(),
      createdDate: startDate.format('MM/DD/YYYY HH:mm:SS'),
      typeOfCareId: 'CR1',
    };
    request.id = '1234';
    mockPastAppointmentInfo({ va: [], requests: [request] });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(startDate.format('dddd, MMMM D'), 'i'),
    );

    const firstCard = screen.getAllByRole('listitem')[0];

    expect(firstCard).to.contain.text('Express Care request');
  });

  it('should include cancelled and pending Express Care requests that are more than 2 days old', async () => {
    const startDate = moment().subtract(3, 'days');
    const pendingRequest = getVARequestMock();
    pendingRequest.attributes = {
      ...pendingRequest.attributes,
      status: 'Submitted',
      optionDate1: startDate.format('MM/DD/YYYY'),
      optionTime1: 'AM',
      date: startDate.format(),
      createdDate: startDate.format('MM/DD/YYYY HH:mm:SS'),
      typeOfCareId: 'CR1',
    };
    pendingRequest.id = '1234';
    const cancelledRequest = { ...pendingRequest };
    cancelledRequest.attributes = {
      ...cancelledRequest.attributes,
      status: 'Cancelled',
    };
    cancelledRequest.id = '12345';
    mockPastAppointmentInfo({
      va: [],
      requests: [pendingRequest, cancelledRequest],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findAllByText(
      new RegExp(startDate.format('dddd, MMMM D'), 'i'),
    );

    const cards = screen.getAllByRole('listitem');

    expect(cards.length).to.equal(2);

    expect(cards[0]).to.contain.text('Express Care request');
    expect(cards[1]).to.contain.text('Canceled');
  });

  it('should not include cancelled and pending Express Care requests that are less than 2 days old', async () => {
    const startDate = moment().subtract(1, 'days');
    const pendingRequest = getVARequestMock();
    pendingRequest.attributes = {
      ...pendingRequest.attributes,
      status: 'Submitted',
      optionDate1: startDate.format('MM/DD/YYYY'),
      optionTime1: 'AM',
      date: startDate.format(),
      createdDate: startDate.format('MM/DD/YYYY HH:mm:SS'),
      typeOfCareId: 'CR1',
    };
    pendingRequest.id = '1234';
    const cancelledRequest = { ...pendingRequest };
    cancelledRequest.attributes = {
      ...cancelledRequest.attributes,
      status: 'Cancelled',
    };
    cancelledRequest.id = '12345';
    mockPastAppointmentInfo({
      va: [],
      requests: [pendingRequest, cancelledRequest],
    });

    const screen = renderWithStoreAndRouter(<PastAppointmentsListV2 />, {
      initialState,
    });

    await screen.findByText('You don’t have any appointments');

    const cards = screen.queryAllByRole('listitem');

    expect(cards.length).to.equal(0);
  });
});
