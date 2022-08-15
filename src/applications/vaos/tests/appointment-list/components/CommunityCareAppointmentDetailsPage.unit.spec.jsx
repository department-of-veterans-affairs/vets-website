import React from 'react';
import moment from 'moment';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { mockFetch } from 'platform/testing/unit/helpers';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { getCCAppointmentMock } from '../../mocks/v0';
import {
  mockAppointmentInfo,
  mockSingleCommunityCareAppointmentFetch,
  mockSingleVistaCommunityCareAppointmentFetch,
} from '../../mocks/helpers';
import {
  mockSingleVAOSAppointmentFetch,
  mockVAOSAppointmentsFetch,
} from '../../mocks/helpers.v2';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import { createMockAppointmentByVersion } from '../../mocks/data';

import { AppointmentList } from '../../../appointment-list';
import { getICSTokens } from '../../../utils/calendar';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingStatusImprovement: false,
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
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

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
    expect(screen.getByTestId('facility-telephone')).to.exist;
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

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

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
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });

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

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/cc/8a4885896a22f88f016a2cb7f5de0062',
    });

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

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/cc/8a4885896a22f88f016a2cb7f5de0062',
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });

  it('should show cc appointment from vista when directly opening page', async () => {
    const url = '/cc/8a4885896a22f88f016a2cb7f5de0062';
    const data = {
      id: '8a4885896a22f88f016a2cb7f5de0062',
      kind: 'cc',
      start: moment()
        .tz('America/Denver')
        .format('YYYY-MM-DDTHH:mm:ss'),
      communityCareProvider: {},
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

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

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

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
    const tokens = getICSTokens(ics);

    expect(tokens.get('BEGIN')).includes('VCALENDAR');
    expect(tokens.get('VERSION')).to.equal('2.0');
    expect(tokens.get('PRODID')).to.equal('VA');
    expect(tokens.get('BEGIN')).includes('VEVENT');
    expect(tokens.has('UID')).to.be.true;

    // TODO: Should this be provider practice instead of name???
    expect(tokens.get('SUMMARY')).to.equal('Appointment at Rick Katz');

    // The description text longer than 74 characters should start newlines with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      'You have a health care appointment with a community care provi',
    );
    expect(description[1]).to.equal(
      '\tder. Please don’t go to your local VA health facility.',
    );
    expect(description[2]).to.equal('\t\\n\\n123\\n');
    expect(description[3]).to.equal('\tBurke\\, VA 20151\\n');
    expect(description[4]).to.equal('\t(703) 555-1264\\n');
    expect(description[5]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(description[6]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal('123\\, Burke\\, VA 20151');
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${startDateTime
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });

  it('should verify community care calendar ics file format when there is no provider information', async () => {
    const url = '/cc/20abc6741c00ac67b6cbf6b972d084c1';

    const appointmentTime = moment().add(1, 'days');

    const appointment = getCCAppointmentMock();
    appointment.id = '20abc6741c00ac67b6cbf6b972d084c1';
    appointment.attributes = {
      ...appointment.attributes,
      address: undefined,
      appointmentRequestId: '20abc6741c00ac67b6cbf6b972d084c1',
      appointmentTime: appointmentTime.format('MM/DD/YYYY HH:mm:ss'),
      name: undefined,
      providerPhone: undefined,
      providerPractice: undefined,
    };

    mockSingleCommunityCareAppointmentFetch({
      appointment,
    });
    const startDateTime = moment(appointment.attributes.appointmentTime);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

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
    const tokens = getICSTokens(ics);

    expect(tokens.get('BEGIN')).includes('VCALENDAR');
    expect(tokens.get('VERSION')).to.equal('2.0');
    expect(tokens.get('PRODID')).to.equal('VA');
    expect(tokens.get('BEGIN')).includes('VEVENT');
    expect(tokens.has('UID')).to.be.true;

    expect(tokens.get('SUMMARY')).to.equal('Community care appointment');

    // The description text longer than 74 characters should start newlines with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      'You have a health care appointment with a community care provi',
    );
    expect(description[1]).to.equal(
      '\tder. Please don’t go to your local VA health facility.',
    );
    expect(description[2]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(description[3]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal('');
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(startDateTime).format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${startDateTime
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });
});

describe('VAOS <CommunityCareAppointmentDetailsPage> with VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should navigate to community care appointments detail page', async () => {
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    const start = moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD');
    const end = moment()
      .add(395, 'days')
      .format('YYYY-MM-DD');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      serviceType: 'audiology',
      reasonCode: {
        text: 'test comment',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockVAOSAppointmentsFetch({
      start,
      end,
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    mockSingleVAOSAppointmentFetch({ appointment });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
    });

    let detailLinks = await screen.findAllByRole('link', { name: /Detail/i });

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

    expect(screen.getByText(/Type of care/)).to.be.ok;
    expect(screen.getByText(/Community care/)).to.be.ok;
    expect(await screen.findByText(/Atlantic Medical Care/)).to.be.ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Special instructions/,
      }),
    ).to.be.ok;
    expect(screen.getByText(/test comment/)).to.be.ok;
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
    detailLinks = await screen.findAllByRole('link', { name: /Detail/i });
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
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

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
    expect(screen.getByText(/Atlantic Medical Care/)).to.be.ok;
  });
  it('should not display type of care when serviceType is missing or null', async () => {
    // Given when the staff schedules the Community Care appointment for the Veteran
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');
    // When the serviceType is blank or null
    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
          name: {
            family: 'Medical Care',
            given: ['Atlantic'],
          },
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

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
    expect(screen.getByText(/Atlantic Medical Care/)).to.be.ok;
    // Then the appointment details will not display the type of care label
    expect(screen.queryByText(/Type of care/i)).not.to.exist;
  });

  it('should not show "Add to Calendar" for canceled appointments', async () => {
    // Given a user with a canceled CC appointment
    const url = '/cc/01aa456cc';
    const appointmentTime = moment().add(1, 'days');

    const data = {
      id: '01aa456cc',
      kind: 'cc',
      practitioners: [
        {
          identifier: [{ system: null, value: '123' }],
        },
      ],
      description: 'community care appointment',
      comment: 'test comment',
      start: appointmentTime,
      communityCareProvider: {
        providerName: 'Atlantic Medical Care',
      },
      status: 'cancelled',
    };

    const appointment = createMockAppointmentByVersion({
      version: 2,
      ...data,
    });

    mockSingleVAOSAppointmentFetch({
      appointment,
    });

    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingVAOSServiceCCAppointments: true,
        },
      },
      path: url,
    });

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

    // Then the canceled status message should be displayed
    expect(screen.getByText(/Facility canceled your appointment/)).to.be.ok;

    // Then the 'Add to calendar' link should not be displayed
    expect(screen.queryByText(/Add to calendar/)).not.to.exist;
  });
});
