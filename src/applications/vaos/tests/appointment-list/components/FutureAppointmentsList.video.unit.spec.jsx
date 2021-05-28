import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import { getVAFacilityMock, getVideoAppointmentMock } from '../../mocks/v0';
import { renderWithStoreAndRouter } from '../../mocks/setup';

import AppointmentsPage from '../../../appointment-list/components/AppointmentsPage';

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
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      (_, node) => node.textContent === 'VA Video Connect at home',
    );

    expect(baseElement).to.contain('h4');
    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');
    expect(getByText(/join appointment/i)).to.have.attribute(
      'aria-disabled',
      'true',
    );

    expect(
      getByText(
        new RegExp(
          startDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.exist;

    const timeEl = getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(baseElement).to.contain('h4');
    expect(timeEl).to.contain.text('MT');
    expect(timeEl).to.contain.text('Mountain time');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');
    expect(
      global.window.dataLayer.find(
        e =>
          e.event === 'vaos-number-of-items-retrieved' &&
          e['vaos-item-type'] === 'video_home',
      )['vaos-number-of-items'],
    ).to.equal(1);
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

    const {
      baseElement,
      findByText,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(baseElement).to.contain('h4');
    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(getByText(/join appointment/i)).to.have.attribute(
      'aria-disabled',
      'false',
    );
    expect(getByText(/join appointment/i)).to.have.attribute(
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
      <AppointmentsPage />,
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

    expect(getByText(/join appointment/i)).to.have.attribute(
      'aria-disabled',
      'false',
    );

    expect(getByText(/join appointment/i)).to.have.attribute(
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

    const {
      baseElement,
      findByText,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(-239, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(baseElement).to.contain('h4');

    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

    expect(getByText(/join appointment/i)).to.have.attribute(
      'aria-disabled',
      'false',
    );

    expect(getByText(/join appointment/i)).to.have.attribute(
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

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText(
      (_, node) => node.textContent === 'VA Video Connect using a VA device',
    );

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
        name: `Add ${startDate
          .tz('America/Denver')
          .format('MMMM D, YYYY')} appointment to your calendar`,
      }),
    ).to.be.ok;

    // Using queryByText since it won't throw an execption when not found.
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.queryByText(/join appointment/i)).not.to.exist;

    expect(
      global.window.dataLayer.find(
        e =>
          e.event === 'vaos-number-of-items-retrieved' &&
          e['vaos-item-type'] === 'video_gfe',
      )['vaos-number-of-items'],
    ).to.equal(1);
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

    const {
      baseElement,
      findByText,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(baseElement).to.contain('h4');
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

    const {
      baseElement,
      findByText,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      new RegExp(
        moment()
          .tz('America/Denver')
          .add(30, 'minutes')
          .format('dddd, MMMM D, YYYY'),
        'i',
      ),
    );

    expect(baseElement).to.contain('h4');
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
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(
      (_, node) => node.textContent === 'VA Video Connect at home',
    );

    expect(baseElement).to.contain('h4');
    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');
    expect(baseElement).to.contain.text('Canceled');
    expect(baseElement).to.contain('.fa-exclamation-circle');

    expect(getByText(/join appointment/i)).to.have.attribute(
      'aria-disabled',
      'true',
    );

    expect(
      getByText(
        new RegExp(
          startDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.exist;

    const timeEl = getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeEl).to.contain.text('MT');
    expect(timeEl).to.contain.text('Mountain time');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(queryByText(/cancel appointment/i)).not.to.exist;
  });

  it('should show address info for clinic based appointment', async () => {
    const appointment = getVideoAppointmentMock();
    const startDate = moment.utc().add(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: '123',
      sta6aid: '983',
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'CLINIC_BASED',
      status: { description: 'F', code: 'FUTURE' },
      providers: [
        {
          clinic: {
            ien: '455',
            name: 'Testing',
          },
        },
      ],
    };
    mockAppointmentInfo({ va: [appointment] });
    const facility = {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
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
    mockFacilitiesFetch('vha_442', [facility]);

    const {
      findByText,
      baseElement,
      getByText,
      queryByText,
    } = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await findByText(/Cheyenne VA Medical Center/i);
    expect(baseElement).to.contain('h4');
    expect(queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(baseElement).to.contain.text('VA Video Connect');
    expect(baseElement).to.contain.text('Confirmed');
    expect(baseElement).to.contain('.fa-check-circle');

    expect(queryByText(/join appointment/i)).to.not.exist;
    expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(baseElement).to.contain.text('307-778-7550');

    expect(
      getByText(
        new RegExp(
          startDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      ),
    ).to.exist;

    const timeEl = getByText(
      new RegExp(startDate.tz('America/Denver').format('h:mm'), 'i'),
    );
    expect(timeEl).to.contain.text('MT');
    expect(timeEl).to.contain.text('Mountain time');
    expect(baseElement).not.to.contain.text('Some random note');
    expect(getByText(/add to calendar/i)).to.have.tagName('a');
    expect(getByText(/cancel appointment/i)).to.have.tagName('button');

    expect(
      global.window.dataLayer.find(
        e =>
          e.event === 'vaos-number-of-items-retrieved' &&
          e['vaos-item-type'] === 'video_va_facility',
      )['vaos-number-of-items'],
    ).to.equal(1);
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
      providers: [
        {
          name: {
            firstName: 'Meg',
            lastName: 'Smith',
          },
        },
      ],
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

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText(
      (_, node) => node.textContent === 'VA Video Connect at an ATLAS location',
    );

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
    expect(screen.baseElement).to.contain.text('Eureka, MT 59917');

    // Should display directions to location
    expect(
      screen.getByRole('link', {
        name:
          'Directions to ATLAS facility in Eureka, MT Link opens in a new tab.',
      }),
    ).to.be.ok;

    // Should display appointment code
    expect(screen.getByText(/Appointment Code: 7VBBCA/i)).to.be.ok;

    // Should display who you will be meeting with
    expect(screen.getByText(/You’ll be meeting with/i)).to.be.ok;
    expect(screen.getByText(/Meg Smith/i)).to.be.ok;

    expect(
      global.window.dataLayer.find(
        e =>
          e.event === 'vaos-number-of-items-retrieved' &&
          e['vaos-item-type'] === 'video_atlas',
      )['vaos-number-of-items'],
    ).to.equal(1);
  });
});

describe('VAOS integration: calendar ics file format', () => {
  it('should verify Video Connect at home calendar ics file format', async () => {
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
      instructionsTitle: 'Video Visit Preparation',
      providers: [
        {
          name: { firstName: 'Test T+90', lastName: 'Test' },
          location: {
            type: 'VA',
            facility: {
              name: 'CHEYENNE VAMC',
              siteCode: '983',
              timeZone: '10',
            },
          },
          virtualMeetingRoom: {
            conference: 'VVC8275247',
            pin: '7172705#',
            url:
              'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
          },
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
    });

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText('VA Video Connect');

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${startDate
            .tz('America/Denver')
            .format('MMMM D, YYYY')} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');
    expect(tokens[5]).to.contain('SUMMARY:VA Video Connect appointment');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You can join this meeting up to 30 minutes before the start ti',
    );
    expect(tokens[7]).to.equal('\tme.');
    expect(tokens[8]).to.equal('\t\\n\\nVA Video Connect at home\\n');
    expect(tokens[9]).to.equal(
      `\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo`,
    );

    expect(tokens[10]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens[11]).to.equal('LOCATION:VA Video Connect at home');
    expect(tokens[12]).to.equal(
      `DTSTAMP:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[13]).to.equal(
      `DTSTART:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTEND:${startDate
        .clone()
        .add(20, 'minutes') // Default duration
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal('END:VEVENT');
    expect(tokens[16]).to.equal('END:VCALENDAR');
  });

  it('should verify Video Connect at VA location calendar ics file format', async () => {
    const appointment = getVideoAppointmentMock();
    const startDate = moment.utc().add(3, 'days');
    appointment.attributes = {
      ...appointment.attributes,
      facilityId: '983',
      clinicId: '848',
      clinicFriendlyName: 'CHY PC VAR2',
      sta6aid: '983',
      startDate: startDate.format(),
    };
    appointment.attributes.vvsAppointments[0] = {
      ...appointment.attributes.vvsAppointments[0],
      dateTime: startDate.format(),
      bookingNotes: 'Some random note',
      appointmentKind: 'CLINIC_BASED',
      status: { description: 'F', code: 'FUTURE' },
      providers: [
        {
          name: {
            firstName: 'Meg',
            lastName: 'Smith',
          },
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
    });

    const facility = {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
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
    mockFacilitiesFetch('vha_442', [facility]);

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText(
      (_, node) => node.textContent === 'VA Video Connect at a VA location',
    );

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${startDate
            .tz('America/Denver')
            .format('MMMM D, YYYY')} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');

    // TODO: location name???
    expect(tokens[5]).to.equal(
      'SUMMARY:VA Video Connect appointment at Cheyenne VA Medical Center',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You need to join this video meeting from:',
    );
    expect(tokens[7]).to.equal('\t\\n\\nCheyenne VA Medical Center');
    expect(tokens[8]).to.equal('\t\\n2360 East Pershing Boulevard\\n');
    expect(tokens[9]).to.equal('\tCheyenne\\, WY 82001-5356\\n');
    expect(tokens[10]).to.equal('\t307-778-7550\\n');
    expect(tokens[11]).to.equal("\t\\nYou'll be meeting with Meg Smith\\n");
    expect(tokens[12]).to.equal(
      `\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo`,
    );

    expect(tokens[13]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens[14]).to.equal(
      'LOCATION:2360 East Pershing Boulevard\\, Cheyenne\\, WY 82001-5356',
    );
    expect(tokens[15]).to.equal(
      `DTSTAMP:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal(
      `DTSTART:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[17]).to.equal(
      `DTEND:${startDate
        .clone()
        .add(20, 'minutes') // Default duration
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[18]).to.equal('END:VEVENT');
    expect(tokens[19]).to.equal('END:VCALENDAR');
  });

  it('should verify Video Connect at ATLAS calendar ics file format', async () => {
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
      providers: [
        {
          name: {
            firstName: 'Meg',
            lastName: 'Smith',
          },
        },
      ],
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

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText(
      (_, node) => node.textContent === 'VA Video Connect at an ATLAS location',
    );

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${startDate
            .tz('America/Denver')
            .format('MMMM D, YYYY')} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');
    // TODO: location name???
    expect(tokens[5]).to.equal(
      'SUMMARY:VA Video Connect appointment at an ATLAS facility',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:Join this video meeting from this ATLAS (non-VA) location:',
    );
    expect(tokens[7]).to.equal(`\t\\n\\n114 Dewey Ave\\n`);
    expect(tokens[8]).to.equal('\tEureka\\, MT 59917\\n');
    expect(tokens[9]).to.equal(
      '\t\\nYour appointment code is 7VBBCA. Use this code to find your appointment ',
    );
    expect(tokens[10]).to.equal('\ton the computer at the ATLAS facility.\\n');
    expect(tokens[11]).to.equal("\t\\nYou'll be meeting with Meg Smith\\n");

    expect(tokens[12]).to.equal('LOCATION:114 Dewey Ave\\, Eureka\\, MT 59917');
    expect(tokens[13]).to.equal(
      `DTSTAMP:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTSTART:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal(
      `DTEND:${startDate
        .clone()
        .add(20, 'minutes') // Default duration
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal('END:VEVENT');
    expect(tokens[17]).to.equal('END:VCALENDAR');
  });

  it('should verify Video Connect on VA device calendar ics file format', async () => {
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
      providers: [
        {
          name: { firstName: 'Test T+90', lastName: 'Test' },
          contactInformation: {
            mobile: '8888888888',
            preferredEmail: 'marcy.nadeau@va.gov',
            timeZone: '10',
          },
          location: {
            type: 'VA',
            facility: {
              name: 'CHEYENNE VAMC',
              siteCode: '983',
              timeZone: '10',
            },
          },
          virtualMeetingRoom: {
            conference: 'VVC8275247',
            pin: '7172705#',
            url:
              'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
          },
        },
      ],
    };
    mockAppointmentInfo({
      va: [appointment],
    });

    const screen = renderWithStoreAndRouter(<AppointmentsPage />, {
      initialState,
    });

    await screen.findByText(
      (_, node) => node.textContent === 'VA Video Connect using a VA device',
    );

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${startDate
            .tz('America/Denver')
            .format('MMMM D, YYYY')} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    // TODO: Debugging
    // console.log(tokens);

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');

    expect(tokens[5]).to.equal(
      'SUMMARY:VA Video Connect appointment using a VA device',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:Join this video meeting using a device provided by VA.',
    );
    expect(tokens[7]).to.equal("\t\\nYou'll be meeting with Test T+90 Test\\n");

    expect(tokens[8]).to.equal('LOCATION:');
    expect(tokens[9]).to.equal(
      `DTSTAMP:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[10]).to.equal(
      `DTSTART:${moment(startDate)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[11]).to.equal(
      `DTEND:${startDate
        .clone()
        .add(20, 'minutes') // Default mock duration
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[12]).to.equal('END:VEVENT');
    expect(tokens[13]).to.equal('END:VCALENDAR');
  });
});
