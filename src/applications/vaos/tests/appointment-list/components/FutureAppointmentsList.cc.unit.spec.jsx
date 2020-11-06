import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import reducers from '../../../redux/reducer';
import { getCCAppointmentMock, getVAAppointmentMock } from '../../mocks/v0';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../mocks/setup';

import FutureAppointmentsList from '../../../appointment-list/components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: upcoming CC appointments', () => {
  it('should show information', async () => {
    const appointmentTime = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: appointmentTime
        .clone()
        .add(5, 'hours')
        .format('MM/DD/YYYY HH:mm:ss'),
      timeZone: '-05:00 EST',
      instructionsToVeteran: 'Bring your glasses',
      address: {
        street: '123 Big Sky st',
        city: 'Bozeman',
        state: 'MT',
        zipCode: '59715',
      },
      name: { firstName: 'Jane', lastName: 'Doctor' },
      providerPractice: 'Big sky medical',
      providerPhone: '4065555555',
    };

    mockAppointmentInfo({ cc: [appointment] });
    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
    });

    const dateHeader = await findByText(
      new RegExp(appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'), 'i'),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('Community Care');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(dateHeader).to.have.tagName('h3');
    expect(getByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=123 Big Sky st, Bozeman, MT 59715',
    );
    expect(baseElement).to.contain.text('Big sky medical');
    expect(baseElement).to.contain.text('123 Big Sky st');
    expect(baseElement).to.contain.text('Bozeman, MT 59715');
    expect(baseElement).to.contain.text('406-555-5555');
    expect(baseElement).to.contain.text('Special instructions');
    expect(baseElement).to.contain.text('Bring your glasses');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
  });

  it('should display Community Care header for Vista CC appts', async () => {
    const appointmentTime = moment().add(1, 'days');
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: appointmentTime.format(),
      communityCare: true,
      vdsAppointments: { bookingNote: 'scheduler note' },
    };

    mockAppointmentInfo({ cc: [appointment] });
    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
      reducers,
    });

    const dateHeader = await findByText(
      new RegExp(appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'), 'i'),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('Community Care');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(dateHeader).to.have.tagName('h3');
    expect(queryByText(/directions/i)).not.to.exist;
    expect(baseElement).not.to.contain.text('Special instructions');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
  });

  it('should not display when over 13 months away', () => {
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: moment()
        .add(14, 'months')
        .format('MM/DD/YYYY HH:mm:ss'),
      timeZone: '+05:00 EST',
    };

    mockAppointmentInfo({ va: [appointment] });
    const { findByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
      },
    );

    return expect(findByText(/You don’t have any appointments/i)).to.eventually
      .be.ok;
  });

  it('should handle UTC zone', async () => {
    const appointmentTime = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };

    mockAppointmentInfo({ cc: [appointment] });
    const { findByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
      },
    );

    const dateHeader = await findByText(
      new RegExp(appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'), 'i'),
    );
    expect(dateHeader).to.contain.text('UTC');
  });
});
