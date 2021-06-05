import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getCancelReasonMock,
} from '../../../mocks/v0';
import {
  mockAppointmentInfo,
  mockFacilitiesFetch,
  mockFacilityFetch,
  mockSingleAppointmentFetch,
  mockVACancelFetches,
} from '../../../mocks/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../../mocks/setup';

import userEvent from '@testing-library/user-event';
import { AppointmentList } from '../../../../appointment-list';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingCheetah: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <ConfirmedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should show confirmed appointments detail page', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      sta6aid: '983GC',
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: {
          main: '970-224-1550',
        },
      },
    };

    mockFacilityFetch('vha_442GC', facility);
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${moment()
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: ASAP/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

    // Verify back button works...
    userEvent.click(screen.getByText(/VA online scheduling/i));
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });
    const detailLink = detailLinks.find(a => a.getAttribute('href') === url);

    // Go back to Appointment detail...
    userEvent.click(detailLink);

    // Verify page content...
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
        // name: /Thursday, January 28, 2021/,
      }),
    ).to.be.ok;

    // Verify breadcrumb links works...
    const VAOSHomepageLink = await screen.findByRole('link', {
      name: /VA online scheduling/,
    });
    userEvent.click(VAOSHomepageLink);
    expect(await screen.findAllByText(/Detail/)).to.be.ok;
  });

  it('should show confirmed appointment without facility information', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      sta6aid: null,
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    expect(await screen.findByText(/Find facility information/)).to.be.ok;

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /You shared these details about your concern/,
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: ASAP/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          moment()
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;
  });
  it('should show past confirmed appointments detail page', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      sta6aid: '983GC',
      startDate: moment().subtract(1, 'day'),
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: {
          main: '970-224-1550',
        },
      },
    };

    mockFacilityFetch('vha_442GC', facility);
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${moment()
          .subtract(1, 'day')
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          moment()
            .subtract(1, 'day')
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(screen.baseElement).to.contain.text(
      'This appointment occurred in the past.',
    );

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: ASAP/)).to.be.ok;
    expect(screen.baseElement).not.to.contain.text(
      new RegExp(
        moment()
          .subtract(1, 'day')
          .tz('America/Denver')
          .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
        'i',
      ),
    );
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.baseElement).not.to.contain.text('Cancel appointment');
  });

  it('should allow cancellation', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
      startDate: moment(),
      vdsAppointments: [
        {
          clinic: {
            name: 'CHY OPT VAR1',
          },
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilitiesFetch('vha_442GC', [facility]);

    const cancelReason = getCancelReasonMock();
    cancelReason.attributes = {
      ...cancelReason.attributes,
      number: '5',
    };
    mockVACancelFetches('983', [cancelReason]);
    const screen = renderWithStoreAndRouter(
      <AppointmentList featureHomepageRefresh />,
      {
        initialState,
      },
    );

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
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    // VA appointment id from confirmed_va.json
    expect(screen.baseElement).not.to.contain.text('canceled');

    userEvent.click(screen.getByText(/cancel appointment/i));

    await screen.findByRole('alertdialog');

    userEvent.click(screen.getByText(/yes, cancel this appointment/i));

    await screen.findByText(/your appointment has been canceled/i);

    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointments/cancel')).args[1]
        .body,
    );

    expect(cancelData).to.deep.equal({
      appointmentTime: moment()
        .tz('America/Denver')
        .format('MM/DD/YYYY HH:mm:ss'),
      cancelReason: '5',
      cancelCode: 'PC',
      clinicName: 'CHY OPT VAR1',
      clinicId: '308',
      facilityId: '983',
      remarks: '',
    });

    userEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text(
      'You canceled this appointment.',
    );
  });

  it('should not allow cancelation of COVID-19 vaccine appointments', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      char4: 'CDQC', // COVID vaccine char4 code
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
      startDate: moment(),
      vdsAppointments: [{ clinic: { name: 'CHY OPT VAR1' } }],
    };

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/COVID-19 vaccine/i)).to.exist;

    expect(screen.baseElement).not.to.contain.text('Cancel appointment');

    expect(screen.baseElement).to.contain.text(
      'Contact this provider if you need to reschedule or cancel your appointment.',
    );
  });

  it('should display who canceled the appointment', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
      vdsAppointments: [
        {
          currentStatus: 'CANCELLED BY CLINIC',
        },
      ],
    };

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(
      await screen.findByText(
        /Fort Collins VA Clinic canceled this appointment./i,
      ),
    ).to.exist;
  });

  it('should display who canceled the appointment for past appointments', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
      startDate: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DDThh:mm:[00Z]'),
      vdsAppointments: [
        {
          currentStatus: 'CANCELLED BY CLINIC',
        },
      ],
    };
    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(
      await screen.findByText(
        /Fort Collins VA Clinic canceled this appointment./i,
      ),
    ).to.exist;

    // The canceled appointment and past appointment alerts are mutually exclusive
    // with the canceled appointment status having 1st priority. So, the canceled
    // appointment alert should display even when the appointment is a past
    // appointment.
    expect(screen.queryByText('This appointment occurred in the past.')).not.to
      .exist;
  });

  it('should fire a print request when print button clicked', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

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
          moment()
            .tz('America/Denver')
            .format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;

    expect(printSpy.notCalled).to.be.true;
    fireEvent.click(await screen.findByText(/Print/i));
    expect(printSpy.calledOnce).to.be.true;
    global.window.print = oldPrint;
  });

  it('should show error message when single fetch errors', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();

    mockSingleAppointmentFetch({
      appointment,
      error: true,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');

      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'We’re sorry. We’ve run into a problem',
        }),
      ).to.be.ok;
    });
  });

  it('should allow the user to close the cancel modal without canceling', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
    };

    mockAppointmentInfo({ va: [appointment], isHomepageRefresh: true });

    mockSingleAppointmentFetch({ appointment });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    userEvent.click(screen.getByText(/cancel appointment/i));

    await screen.findByRole('alertdialog');

    userEvent.click(screen.getByText(/no, take me back/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.not.contain.text(
      'You canceled this appointment.',
    );
  });

  it('should allow the user to go back to the appointment list', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      facilityId: '983',
      sta6aid: '983GC',
      vdsAppointments: [{ currentStatus: 'CANCELLED BY CLINIC' }],
    };

    mockSingleAppointmentFetch({ appointment });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    userEvent.click(screen.getByText(/VA online scheduling/i));
    expect(screen.baseElement).to.contain.text('Your appointments');
  });

  it('should verify VA in person calendar ics file format', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      sta6aid: '983GC',
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: {
          main: '970-224-1550',
        },
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const startDateTime = moment(appointment.start);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${moment()
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${moment(appointment.start)
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
    expect(tokens[5]).to.equal('SUMMARY:Appointment at Fort Collins VA Clinic');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      'DESCRIPTION:You have a health care appointment at Fort Collins VA Clinic',
    );
    expect(tokens[7]).to.equal('\t\\n\\nFake street\\n');
    expect(tokens[8]).to.equal('\tFake city\\, FA fake zip\\n');
    expect(tokens[9]).to.equal('\t970-224-1550\\n');
    expect(tokens[10]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(tokens[11]).to.equal(
      '\tintments to get details about this appointment\\n',
    );

    expect(tokens[12]).to.equal(
      'LOCATION:Fake street\\, Fake city\\, FA fake zip',
    );
    expect(tokens[13]).to.equal(
      `DTSTAMP:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[14]).to.equal(
      `DTSTART:${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal(
      `DTEND:${startDateTime
        .clone()
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal('END:VEVENT');
    expect(tokens[17]).to.equal('END:VCALENDAR');
  });

  it('should verify VA phone calendar ics file format', async () => {
    const url = '/va/22cdc6741c00ac67b6cbf6b972d084c0';

    const appointment = getVAAppointmentMock();
    appointment.id = '22cdc6741c00ac67b6cbf6b972d084c0';
    appointment.attributes = {
      ...appointment.attributes,
      clinicId: '308',
      clinicFriendlyName: "Jennie's Lab",
      facilityId: '983',
      phoneOnly: true,
      sta6aid: '983GC',
      start: '2021-06-20T16:00:00Z',
      vdsAppointments: [
        {
          bookingNote: 'New issue: ASAP',
        },
      ],
    };

    mockAppointmentInfo({
      va: [appointment],
      isHomepageRefresh: true,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: {
          main: '970-224-1550',
        },
      },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${moment(appointment.start)
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${moment(appointment.start)
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
    expect(tokens[5]).to.equal('SUMMARY:Phone appointment');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    expect(tokens[6]).to.equal(
      `DESCRIPTION:A provider will call you at ${moment(appointment.start)
        .tz('America/Denver')
        .format('h:mm a')}`,
    );
    expect(tokens[7]).to.equal('\t\\n\\nCheyenne VA Medical Center');
    expect(tokens[8]).to.equal('\t\\nFake street\\n');
    expect(tokens[9]).to.equal('\tFake city\\, FA fake zip\\n');
    expect(tokens[10]).to.equal('\t970-224-1550\\n');
    expect(tokens[11]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(tokens[12]).to.equal(
      '\tintments to get details about this appointment\\n',
    );

    expect(tokens[13]).to.equal('LOCATION:Phone call');
    expect(tokens[14]).to.equal(
      `DTSTAMP:${moment(appointment.start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[15]).to.equal(
      `DTSTART:${moment(appointment.start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[16]).to.equal(
      `DTEND:${moment(appointment.start)
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens[17]).to.equal('END:VEVENT');
    expect(tokens[18]).to.equal('END:VCALENDAR');
  });
});
