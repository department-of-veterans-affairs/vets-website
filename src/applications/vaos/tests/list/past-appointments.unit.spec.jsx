import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import reducers from '../../reducers';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getVideoAppointmentMock,
  getCCAppointmentMock,
} from '../mocks/v0';
import {
  mockPastAppointmentInfo,
  mockPastAppointmentInfoOption1,
  mockFacilitiesFetch,
} from '../mocks/helpers';

import PastAppointmentsList from '../../components/PastAppointmentsList';

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

    const { queryByText } = renderInReduxProvider(<PastAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(queryByText(/Past 3 months/i)).to.exist;
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
    } = renderInReduxProvider(<PastAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(baseElement).to.contain.text('Loading your appointments');
    await findByText(/You don’t have any appointments/i);

    mockPastAppointmentInfoOption1({ va: [olderAppt] });

    fireEvent.change(getByLabelText(/select a date range/i), {
      target: { value: 1 },
    });

    fireEvent.click(queryByText('Update'));
    expect(baseElement).to.contain.text('Loading your appointments');
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
    } = renderInReduxProvider(<PastAppointmentsList />, {
      initialState,
      reducers,
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

    const { findByText, baseElement, getByText } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(baseElement).to.contain.text('Some clinic');
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('307-778-7550');
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

    const { findByText, baseElement } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
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

    const { findByText, baseElement } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
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
    const { findByText } = renderInReduxProvider(<PastAppointmentsList />, {
      initialState,
      reducers,
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

    const { findByText, baseElement, queryByText } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    const dateHeader = await findByText(
      new RegExp(
        pastDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');

    expect(dateHeader).to.have.tagName('h3');
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

    const { baseElement, findAllByRole } = renderInReduxProvider(
      <PastAppointmentsList />,
      {
        initialState,
        reducers,
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
});
