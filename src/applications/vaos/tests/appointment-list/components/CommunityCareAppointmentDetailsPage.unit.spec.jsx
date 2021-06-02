import React from 'react';
import moment from 'moment';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { mockFetch } from 'platform/testing/unit/helpers';
import { getCCAppointmentMock, getVAAppointmentMock } from '../../mocks/v0';
import {
  mockAppointmentInfo,
  mockSingleCommunityCareAppointmentFetch,
  mockSingleVistaCommunityCareAppointmentFetch,
} from '../../mocks/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';

import userEvent from '@testing-library/user-event';
import { AppointmentList } from '../../../appointment-list';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <CommunityCareAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should navigate to community care appointments detail page', async () => {
    // CC appointment id from confirmed_cc.json
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';
    const appointmentTime = moment().add(1, 'days');

    const appointment = getCCAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
      distanceEligibleConfirmed: true,
      name: { firstName: 'Rick', lastName: 'Katz' },
      providerPractice: 'My Eye Dr',
      providerPhone: '(703) 555-1264',
      address: {
        street: '123',
        city: 'Burke',
        state: 'VA',
        zipCode: '20151',
      },
      instructionsToVeteran: 'Bring your glasses',
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };

    mockAppointmentInfo({
      va: [],
      cc: [appointment],
      requests: [],
      isHomepageRefresh: true,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
      },
    );

    let detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    // Select an appointment details link...
    let detailLink = detailLinks.find(l => l.getAttribute('href') === url);
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(screen.getByText(/123/)).to.be.ok;
    expect(screen.getByText(/Burke,/)).to.be.ok;
    expect(screen.getByRole('link', { name: /7 0 3. 5 5 5. 1 2 6 4./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Special instructions/,
      }),
    ).to.be.ok;
    expect(screen.getByText(/Bring your glasses/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: `Add ${appointmentTime.format(
          'MMMM D, YYYY',
        )} appointment to your calendar`,
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;

    // Verify back button works...
    userEvent.click(screen.getByText(/VA online scheduling/i));
    detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });
    detailLink = detailLinks.find(a => a.getAttribute('href') === url);

    // Go back to Appointment detail...
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    // Verify breadcrumb links works...
    const VAOSHomepageLink = await screen.findByRole('link', {
      name: /VA online scheduling/,
    });
    userEvent.click(VAOSHomepageLink);
    expect(await screen.findAllByText(/Detail/)).to.be.ok;
  });

  it('should show cc info when directly opening page', async () => {
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';

    const appointment = getCCAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
      distanceEligibleConfirmed: true,
      name: { firstName: 'Rick', lastName: 'Katz' },
      providerPractice: 'My Eye Dr',
      providerPhone: '(703) 555-1264',
      address: {
        street: '123',
        city: 'Burke',
        state: 'VA',
        zipCode: '20151',
      },
      appointmentTime: '05/20/2021 14:15:00',
      timeZone: 'UTC',
    };

    mockSingleCommunityCareAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
        path: url,
      },
    );

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /^Thursday, May 20, 2021/,
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(screen.getByText(/Rick Katz/)).to.be.ok;
  });

  it('should fire a print request when print button clicked', async () => {
    // CC appointment id from confirmed_cc.json
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';
    const appointmentTime = moment().add(1, 'days');

    const appointment = getCCAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
      distanceEligibleConfirmed: true,
      name: { firstName: 'Rick', lastName: 'Katz' },
      providerPractice: 'My Eye Dr',
      providerPhone: '(703) 555-1264',
      address: {
        street: '123',
        city: 'Burke',
        state: 'VA',
        zipCode: '20151',
      },
      instructionsToVeteran: 'Bring your glasses',
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };

    mockAppointmentInfo({
      va: [],
      cc: [appointment],
      requests: [],
      isHomepageRefresh: true,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
      },
    );

    const oldPrint = global.window.print;
    const printSpy = sinon.spy();
    global.window.print = printSpy;

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    // Select an appointment details link...
    const detailLink = detailLinks.find(l => l.getAttribute('href') === url);
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;

    expect(printSpy.notCalled).to.be.true;
    fireEvent.click(await screen.findByText(/Print/i));
    expect(printSpy.calledOnce).to.be.true;
    global.window.print = oldPrint;
  });

  it('should show an error when cc data fetch fails', async () => {
    mockSingleCommunityCareAppointmentFetch({
      error: true,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
        path: '/cc/8a4885896a22f88f016a2cb7f5de0062',
      },
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });

  it('should show an error when CC appointment not found in list', async () => {
    const appointment = getCCAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '1234',
    };

    mockSingleCommunityCareAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
        path: '/cc/8a4885896a22f88f016a2cb7f5de0062',
      },
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });

  it('should show cc appointment from vista when directly opening page', async () => {
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';

    const appointment = getVAAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: 'COMMUNITY CARE',
      facilityId: '983',
      sta6aid: '983GC',
      communityCare: true,
      vdsAppointments: [
        {
          bookingNote: '',
          appointmentLength: '60',
          appointmentTime: '2021-12-07T16:00:00Z',
          clinic: {
            name: 'CHY OPT VAR1',
            askForCheckIn: false,
            facilityCode: '983',
          },
          type: 'REGULAR',
          currentStatus: 'FUTURE',
        },
      ],
      vvsAppointments: [],
    };

    mockSingleVistaCommunityCareAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText(/Community care/)).to.be.ok;
  });

  it('should verify community care calendar ics file format', async () => {
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';
    const appointmentTime = moment().add(1, 'days');
    const appointment = getCCAppointmentMock();
    appointment.id = '8a4885896a22f88f016a2cb7f5de0062';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
      distanceEligibleConfirmed: true,
      name: { firstName: 'Rick', lastName: 'Katz' },
      providerPractice: 'My Eye Dr',
      providerPhone: '(703) 555-1264',
      address: {
        street: '123',
        city: 'Burke',
        state: 'VA',
        zipCode: '20151',
      },
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      timeZone: 'UTC',
    };

    mockSingleCommunityCareAppointmentFetch({
      appointment,
    });
    const startDateTime = moment(appointment.attributes.appointmentTime);

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
        path: url,
      },
    );

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          appointmentTime.format('dddd, MMMM D, YYYY [at] h:mm a'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: `Add ${appointmentTime.format(
          'MMMM D, YYYY',
        )} appointment to your calendar`,
      }),
    ).to.be.ok;

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${appointmentTime.format(
            'MMMM D, YYYY',
          )} appointment to your calendar`,
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');

    // TODO: Should this be provider practice instead of name???
    expect(tokens[5]).to.equal('SUMMARY:Appointment at Rick Katz');

    // The description text longer than 74 characters should start newlines with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment with a community care provi',
    );
    expect(tokens[7]).to.equal(
      '\tder. Please don’t go to your local VA health facility.',
    );
    expect(tokens[8]).to.equal('\t\\n\\n123\\n');
    expect(tokens[9]).to.equal('\tBurke\\, VA 20151\\n');
    expect(tokens[10]).to.equal('\t(703) 555-1264\\n');
    expect(tokens[11]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(tokens[12]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens[13]).to.equal('LOCATION:123\\, Burke\\, VA 20151');
    expect(tokens[14]).to.equal(
      `DTSTAMP:${moment(startDateTime)
        // .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal(
      `DTSTART:${moment(startDateTime)
        // .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal(
      `DTEND:${startDateTime
        .clone()
        .add(60, 'minutes')
        // .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[17]).to.equal('END:VEVENT');
    expect(tokens[18]).to.equal('END:VCALENDAR');
  });

  it('should verify community care calendar ics file format when there is no provider information', async () => {
    const url = '/cc/20abc6741c00ac67b6cbf6b972d084c1';

    const appointment = getCCAppointmentMock();
    appointment.id = '20abc6741c00ac67b6cbf6b972d084c1';
    appointment.attributes = {
      ...appointment.attributes,
      address: undefined,
      appointmentRequestId: '20abc6741c00ac67b6cbf6b972d084c1',
      appointmentTime: '09/19/2021 16:00:00',
      name: undefined,
      providerPhone: undefined,
      providerPractice: undefined,
    };

    mockSingleCommunityCareAppointmentFetch({
      appointment,
    });
    const startDateTime = moment(appointment.attributes.appointmentTime);

    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
        path: url,
      },
    );

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /^Sunday, September 19, 2021/,
      }),
    ).to.be.ok;

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: 'Add September 19, 2021 appointment to your calendar',
        })
        .getAttribute('href')
        .replace('data:text/calendar;charset=utf-8,', ''),
    );
    const tokens = ics.split('\r\n');

    expect(tokens[0]).to.equal('BEGIN:VCALENDAR');
    expect(tokens[1]).to.equal('VERSION:2.0');
    expect(tokens[2]).to.equal('PRODID:VA');
    expect(tokens[3]).to.equal('BEGIN:VEVENT');
    expect(tokens[4]).to.contain('UID:');

    expect(tokens[5]).to.equal('SUMMARY:Community care appointment');

    // The description text longer than 74 characters should start newlines with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment with a community care provi',
    );
    expect(tokens[7]).to.equal(
      '\tder. Please don’t go to your local VA health facility.',
    );
    expect(tokens[8]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(tokens[9]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens[10]).to.equal('LOCATION:');
    expect(tokens[11]).to.equal(
      `DTSTAMP:${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[12]).to.equal(
      `DTSTART:${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[13]).to.equal(
      `DTEND:${startDateTime
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal('END:VEVENT');
    expect(tokens[15]).to.equal('END:VCALENDAR');
  });
});
