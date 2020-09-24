import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { mockAppointmentInfo } from '../mocks/helpers';
import { getVideoAppointmentMock } from '../mocks/v0';
import { renderWithStoreAndRouter } from '../mocks/setup';

import FutureAppointmentsList from '../../appointment-list/components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: upcoming video appointments', () => {
  it('should show info and disabled link when ad hoc', async () => {
    const appointment = getVideoAppointmentMock();
    const startDate = moment.utc().add(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
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
    } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
    });

    const dateHeader = await findByText(
      new RegExp(
        startDate.tz('America/Denver').format('dddd, MMMM D, YYYY [at] h:mm'),
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
    expect(dateHeader).to.contain.text('MT');
    expect(dateHeader).to.contain.text('Mountain time');
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

    const { findByText, getByText, queryByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
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

  it('should show active link less than 30 minutes in the future', async () => {
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: moment()
        .add(20, 'minutes')
        .format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: moment()
        .add(20, 'minutes')
        .format(),
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

    const { findByText, getByText, queryByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
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

    const { findByText, getByText, queryByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
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
    const startDate = moment().add(30, 'minutes');
    const appointment = getVideoAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      appointmentKind: 'MOBILE_GFE',
      status: { description: 'F', code: 'FUTURE' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
    });

    await screen.findByText(/Video appointment using a VA device/i);

    // Should display appointment date
    expect(
      screen.getByText(
        new RegExp(
          startDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.be.ok;

    // Should display appointment status
    expect(screen.getByText(/Confirmed/i)).to.be.ok;

    // Should display how to join instructions
    expect(screen.getByText(/How to join your video appointment/i)).to.be.ok;
    expect(
      screen.getByText(
        /You can join this video meeting using a device provided by VA./i,
      ),
    ).to.be.ok;

    // Should display button to add appointment to calendar
    expect(
      screen.getByRole('link', {
        name: `Add ${startDate.format(
          'MMMM D, YYYY',
        )} appointment to your calendar`,
      }),
    ).to.be.ok;

    // Using queryByText since it won't throw an execption when not found.
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.queryByText(/join session/i)).not.to.exist;
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

    const { findByText, getByText, queryByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
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

    const { findByText, getByText, queryByText } = renderWithStoreAndRouter(
      <FutureAppointmentsList />,
      {
        initialState,
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

  it('should display canceled appointment', async () => {
    const appointment = getVideoAppointmentMock();
    const startDate = moment.utc().add(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'CANCELLED BY PATIENT' },
    };
    mockAppointmentInfo({ va: [appointment] });

    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
    });

    const dateHeader = await findByText(
      new RegExp(
        startDate.tz('America/Denver').format('dddd, MMMM D, YYYY [at] h:mm'),
        'i',
      ),
    );

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');
    expect(baseElement).to.contain.text('Canceled');
    expect(baseElement).to.contain('.fa-exclamation-circle');

    expect(getByText(/join session/i)).to.have.attribute(
      'aria-disabled',
      'true',
    );

    expect(dateHeader).to.have.tagName('h3');
    expect(dateHeader).to.contain.text('MT');
    expect(dateHeader).to.contain.text('Mountain time');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(queryByText(/cancel appointment/i)).not.to.exist;
  });
});

describe('VAOS integration: upcoming ATLAS video appointments', () => {
  it('should display ATLAS title', async () => {
    const appointment = getVideoAppointmentMock();
    const startDate = moment.utc().add(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: null,
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'ADHOC',
      status: { description: 'F', code: 'FUTURE' },

      tasInfo: {
        siteCode: '9931',
        slotId: 'Slot8',
        confirmationCode: '7VBBCA',
        address: {
          streetAddress: '114 Dewey Ave',
          city: 'Eureka',
          state: 'MT',
          zipCode: '59917',
          country: 'USA',
          longitude: null,
          latitude: null,
          additionalDetails: '',
        },
        contacts: [
          {
            name: 'Decker Konya',
            phone: '5557582786',
            email: 'Decker.Konya@va.gov',
          },
        ],
      },
    };

    mockAppointmentInfo({ va: [appointment] });

    const screen = renderWithStoreAndRouter(<FutureAppointmentsList />, {
      initialState,
    });

    await screen.findByText(/Video appointment at an ATLAS location/i);

    // Should display appointment date
    expect(
      screen.getByText(
        new RegExp(
          startDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.be.ok;

    // Should display appointment status
    expect(screen.getByText(/Confirmed/i)).to.be.ok;

    // Should display how to join instructions
    expect(screen.getByText(/How to join your video appointment/i)).to.be.ok;
    expect(
      screen.getByText(
        /You must join this video meeting from the ATLAS \(non-VA\) location listed below./i,
      ),
    ).to.be.ok;

    // Should display appointment location address
    expect(screen.getByText(/114 Dewey Ave/i)).to.be.ok;
    expect(screen.getByText(/Eureka, MT 59917/i)).to.be.ok;

    // Should display directions to location
    expect(
      screen.getByRole('link', {
        name: 'Directions to ATLAS facility in Eureka, MT',
      }),
    ).to.be.ok;

    // Should display appointment code
    expect(screen.getByText(/Appointment Code: 7VBBCA/i)).to.be.ok;

    // Should display who you will be meeting with
    // TODO: This will be added later
    // expect(screen.getByText(/You'll be meeting with/i)).to.be.ok;
    // expect(screen.getByText(/Decker Konya/i)).to.be.ok;
  });
});
