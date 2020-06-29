import React from 'react';
import { expect } from 'chai';
import moment from '../../utils/moment-tz';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import reducers from '../../reducers';
import { mockAppointmentInfo } from '../mocks/helpers';
import { getVideoAppointmentMock } from '../mocks/v0';

import FutureAppointmentsList from '../../components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: upcoming video appointments', () => {
  it('should show info and disabled link when ad hoc', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(3, 'days')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(3, 'days')
        .format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderInReduxProvider(<FutureAppointmentsList />, {
      initialState,
      reducers,
    });

    const dateHeader = await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(3, 'days')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(getByText(/join session/i)).to.have.attribute(
      'aria-disabled',
      'true',
    );

    expect(dateHeader).to.have.tagName('h3');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
  });

  it('should show active link if 30 minutes in the future', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(30, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(30, 'minutes')
        .format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },
      patients: [
        {
          virtualMeetingRoom: {
            url: 'http://videourl.va.gov',
          },
        },
      ],
    };
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, getByText, queryByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(getByText(/join session/i)).to.have.attribute(
      'aria-disabled',
      'false',
    );

    expect(getByText(/join session/i)).to.have.attribute(
      'href',
      'http://videourl.va.gov',
    );
  });

  it('should show active link if less than 4 hours in the past', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(-239, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(-239, 'minutes')
        .format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },
      patients: [
        {
          virtualMeetingRoom: {
            url: 'http://videourl.va.gov',
          },
        },
      ],
    };
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, getByText, queryByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(-239, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(getByText(/join session/i)).to.have.attribute(
      'aria-disabled',
      'false',
    );

    expect(getByText(/join session/i)).to.have.attribute(
      'href',
      'http://videourl.va.gov',
    );
  });
  it('should show message about when to join if mobile gfe', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(30, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(30, 'minutes')
        .format(),
      appointmentKind: 'MOBILE_GFE',
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, baseElement, queryByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(queryByText(/join session/i)).not.to.exist;

    expect(baseElement).to.contain.text(
      'Join the video session from the device provided by the VA',
    );
  });
  it('should reveal medication review instructions', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(30, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(30, 'minutes')
        .format(),
      instructionsTitle: 'Medication Review',
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, getByText, queryByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(queryByText(/medication review/i)).to.not.exist;
    fireEvent.click(getByText(/prepare for video visit/i));

    return expect(findByText(/medication review/i)).to.eventually.be.ok;
  });

  it('should reveal video visit instructions', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(30, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(30, 'minutes')
        .format(),
      instructionsTitle: 'Video Visit Preparation',
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const { findByText, getByText, queryByText } = renderInReduxProvider(
      <FutureAppointmentsList />,
      {
        initialState,
        reducers,
      },
    );

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(queryByText(/before your appointment/i)).to.not.exist;
    fireEvent.click(getByText(/prepare for video visit/i));

    return expect(findByText('Before your appointment:')).to.eventually.be.ok;
  });
});
