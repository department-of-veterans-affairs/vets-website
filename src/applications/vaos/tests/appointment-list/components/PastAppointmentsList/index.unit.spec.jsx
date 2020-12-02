import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getVideoAppointmentMock,
  getCCAppointmentMock,
} from '../../../mocks/v0';
import {
  mockPastAppointmentInfo,
  mockPastAppointmentInfoOption1,
  mockFacilitiesFetch,
} from '../../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../../mocks/setup';

import PastAppointmentsList, {
  getPastAppointmentDateRangeOptions,
} from '../../../../appointment-list/components/PastAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
  },
};

const pastDate = moment().subtract(3, 'days');

describe('VAOS integration: past appointments', () => {
  it('should show select date range dropdown', async () => {
    mockPastAppointmentInfo({ va: [] });

    const { findByText } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    expect(await findByText(/Past 3 months/i)).to.exist;
  });

  it('should update range on dropdown change', async () => {
    const olderAppt = getVAAppointmentMock();
    olderAppt.attributes = {
      ...olderAppt.attributes,
      startDate: moment()
        .subtract(3, 'months')
        .format(),
      clinicFriendlyName: 'Some clinic',
      facilityId: '983',
      sta6aid: '983GC',
    };

    mockPastAppointmentInfo({ va: [] });

    const {
      findByText,
      baseElement,
      queryByText,
      getByLabelText,
    } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await findByText(/You don’t have any appointments/i);

    mockPastAppointmentInfoOption1({ va: [olderAppt] });

    fireEvent.change(getByLabelText(/select a date range/i), {
      target: { value: 1 },
    });

    fireEvent.click(queryByText('Update'));
    const rangeLabel = `${moment()
      .subtract(5, 'months')
      .startOf('month')
      .format('MMM YYYY')} – ${moment()
      .subtract(3, 'months')
      .endOf('month')
      .format('MMM YYYY')}`;
    await findByText(`Showing appointments for: ${rangeLabel}`);
    expect(baseElement).to.contain.text('VA Appointment');
    expect(baseElement).to.contain.text('Completed');
  });

  it('should show appointment without facility details', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'Some clinic',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Bring face mask';

    mockPastAppointmentInfo({ va: [appointment] });
    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    const dateHeader = await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Appointment');
    expect(baseElement).to.contain.text('Completed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(dateHeader).to.have.tagName('h3');
    expect(getByText(/view facility information/i)).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442GC',
    );
    expect(baseElement).not.to.contain.text('Bring face mask');
    expect(queryByText(/add to calendar/i)).not.to.exist;
    expect(queryByText(/cancel appointment/i)).not.to.exist;
    expect(baseElement.querySelector('h4')).to.be.ok;
  });

  it('should show appointment with facility details', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'Some clinic',
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

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <PastAppointmentsList />,
      {
        initialState,
      },
    );

    await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(await findByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(baseElement).to.contain.text('Some clinic');
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('307-778-7550');
    expect(baseElement.querySelector('h4')).to.be.ok;
  });

  it('should show comment for self-scheduled appointments', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'Some clinic',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'CHECKED OUT';
    appointment.attributes.vdsAppointments[0].bookingNote =
      'Follow-up/Routine: Do not eat for 24 hours';
    mockPastAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <PastAppointmentsList />,
      {
        initialState,
      },
    );

    await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );
    expect(baseElement).to.contain.text('Follow-up/Routine');
    expect(baseElement).to.contain.text('Do not eat for 24 hours');
  });

  it('should have correct status when previously cancelled', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: pastDate.format(),
      clinicFriendlyName: 'Some clinic',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    mockPastAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <PastAppointmentsList />,
      {
        initialState,
      },
    );

    await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(baseElement).to.contain.text('Canceled');
    expect(baseElement).to.contain('.fa-exclamation-circle');
    expect(baseElement).not.to.contain.text('Add to calendar');
    expect(baseElement).not.to.contain.text('Cancel appointment');
  });

  it('should not display when they have hidden statuses', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = pastDate.format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockPastAppointmentInfo({ va: [appointment] });
    const { findByText } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    return expect(
      findByText(/You don’t have any appointments in the selected date range/i),
    ).to.eventually.be.ok;
  });

  it('should show expected video information', async () => {
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

    const {
      findByText,
      baseElement,
      queryByText,
      getByText,
    } = renderWithStoreAndRouter(<PastAppointmentsList />, {
      initialState,
    });

    await findByText(
      (_, node) => node.textContent === 'VA Video Connect at home',
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');

    expect(
      getByText(
        new RegExp(
          pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.exist;

    const timeEl = getByText(
      new RegExp(pastDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeEl).to.contain.text('MT');
    expect(timeEl).to.contain.text('Mountain time');
    expect(baseElement).not.to.contain.text('Bring face mask');
    expect(queryByText(/video conference/i)).to.exist;
    expect(queryByText(/add to calendar/i)).to.not.exist;
    expect(queryByText(/cancel appointment/i)).to.not.exist;
  });

  it('should sort appointments by date', async () => {
    const firstDate = moment().add(-3, 'days');
    const secondDate = moment().add(-4, 'days');
    const thirdDate = moment().add(-5, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: firstDate.format(),
    };
    const videoAppointment = getVideoAppointmentMock();
    videoAppointment.attributes = {
      ...videoAppointment.attributes,
      clinicId: null,
      startDate: secondDate.format(),
    };
    videoAppointment.attributes.vvsAppointments[0] = {
      ...videoAppointment.attributes.vvsAppointments[0],
      dateTime: secondDate.format(),
      status: { description: 'F', code: 'CHECKED OUT' },
    };
    const ccAppointment = getCCAppointmentMock();
    ccAppointment.attributes = {
      ...ccAppointment.attributes,
      appointmentTime: thirdDate.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };
    mockPastAppointmentInfo({
      va: [videoAppointment, appointment],
      cc: [ccAppointment],
    });

    const { baseElement, findAllByRole } = renderWithStoreAndRouter(
      <PastAppointmentsList />,
      {
        initialState,
      },
    );

    await findAllByRole('list');

    const dateHeadings = Array.from(
      baseElement.querySelectorAll('#appointments-list h3'),
    ).map(card => card.textContent.trim());

    expect(dateHeadings).to.deep.equal([
      firstDate.format('dddd, MMMM D, YYYY [at] h:mm a'),
      secondDate.format('dddd, MMMM D, YYYY [at] h:mm a'),
      thirdDate.format('dddd, MMMM D, YYYY [at] h:mm a [UTC UTC]'),
    ]);
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
});
