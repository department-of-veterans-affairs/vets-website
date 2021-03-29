import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { setFetchJSONFailure } from 'platform/testing/unit/helpers';
import { getVAAppointmentMock, getVAFacilityMock } from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../mocks/setup';
import AppointmentsPage from '../../../appointment-list/components/AppointmentsPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: upcoming VA appointments', () => {
  it('should show information without facility details', async () => {
    const startDate = moment.utc();
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: startDate.format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].bookingNote = 'Some random note';

    mockAppointmentInfo({ va: [appointment] });
    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    const dateHeader = await findByText(
      new RegExp(
        startDate.tz('America/Denver').format('dddd, MMMM D, YYYY [at] h:mm'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Appointment');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(dateHeader).to.have.tagName('h3');
    expect(dateHeader).to.contain.text('MT');
    expect(dateHeader).to.contain.text('Mountain time');
    expect(getByText(/view facility information/i)).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442GC',
    );
    expect(baseElement).not.to.contain.text('Some random note');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
  });

  it('should show subheader for phone appointments', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.phoneOnly = true;
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).to.contain.text('VA Appointment over the phone');
  });

  it('should show information with facility details', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: moment().format(),
      clinicFriendlyName: 'C&P BEV AUDIO FTC1',
      facilityId: '983',
      sta6aid: '983GC',
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    mockAppointmentInfo({ va: [appointment] });

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
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(await findByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(baseElement).to.contain.text('C&P BEV AUDIO FTC1');
    expect(await findByText(/BEV AUDIO FTC1/)).to.have.tagName('h4');
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('307-778-7550');
    expect(baseElement.querySelector('h4')).to.be.ok;
  });

  it('should show comment for self-scheduled appointments', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].bookingNote =
      'Follow-up/Routine: Instructions';
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).to.contain.text('Follow-up/Routine');
    expect(baseElement).to.contain.text('Instructions');
    expect(await findByText('Follow-up/Routine')).to.have.tagName('h4');
    expect(baseElement.querySelector('h4')).to.be.ok;
  });

  it('should not show comment if does not start with preset purpose text', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
    appointment.attributes.vdsAppointments[0].bookingNote = 'some comment';
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).not.to.contain.text('some comment');
  });

  it('should have correct status when previously cancelled', async () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus =
      'CANCELLED BY CLINIC';
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement } = renderWithStoreAndRouter(
      <AppointmentsPage />,
      {
        initialState,
      },
    );

    await findByText(new RegExp(moment().format('dddd, MMMM D, YYYY'), 'i'));

    expect(baseElement).to.contain.text('Canceled');
    expect(baseElement).to.contain('.fa-exclamation-circle');
    expect(baseElement).not.to.contain.text('Add to calendar');
    expect(baseElement).not.to.contain.text('Cancel appointment');
  });

  it('should not display when they have hidden statuses', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment().format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'NO-SHOW';

    mockAppointmentInfo({ va: [appointment] });
    const { findByText } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });

  it('should not display when over 13 months away', () => {
    const appointment = getVAAppointmentMock();
    appointment.attributes.startDate = moment()
      .add(14, 'months')
      .format();
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    mockAppointmentInfo({ va: [appointment] });
    const { findByText } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });
  it('should show error message when request fails', async () => {
    mockAppointmentInfo({});
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/appointment_requests?start_date=${moment()
          .add(-30, 'days')
          .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
      ),
      { errors: [] },
    );

    const { findByText } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    expect(
      await findByText(
        /We’re having trouble getting your upcoming appointments/i,
      ),
    ).to.be.ok;
  });
  it('should show error message when partial errors are returned', async () => {
    mockAppointmentInfo({
      va: [],
      partialError: {
        code: '983',
        source: 'VIA',
        summary: 'something',
      },
    });

    const { findByText } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    expect(
      await findByText(
        /We’re having trouble getting your upcoming appointments/i,
      ),
    ).to.be.ok;
  });
});
