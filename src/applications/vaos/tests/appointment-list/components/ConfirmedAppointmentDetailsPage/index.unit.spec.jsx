import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from 'platform/testing/unit/helpers';
import { getCancelReasonMock } from '../../../mocks/v0';
import {
  mockAppointmentInfo,
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
import { getICSTokens } from '../../../../utils/calendar';
import {
  mockAppointmentCancelFetch,
  mockSingleVAOSAppointmentFetch,
} from '../../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../../mocks/v2';
import {
  mockFacilitiesFetchByVersion,
  mockFacilityFetchByVersion,
  mockSingleClinicFetchByVersion,
} from '../../../mocks/fetch';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../../mocks/data';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingVAOSServiceVAAppointments: false,
  },
};

describe('VAOS <ConfirmedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
    mockFacilitiesFetchByVersion({ version: 0 });
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should show confirmed appointments detail page', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const today = moment.utc();
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: '308',
      start: today.tz('America/Denver').format(),
      locationId: '983GC',
      status: 'booked',
      clinicFriendlyName: "Jennie's Lab",
      comment: 'New issue: ASAP',
      stopCode: '123',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: '970-224-1550',
        version: 0,
      }),
      version: 0,
    });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${today
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          today.tz('America/Denver').format('dddd, MMMM D, YYYY'),
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
          today
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Nutrition and food/i)).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

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
          today.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
        // name: /Thursday, January 28, 2021/,
      }),
    ).to.be.ok;
  });

  it('should show confirmed appointment without facility information', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: moment.tz('America/Denver').format(),
      locationId: '983GC',
      clinicFriendlyName: "Jennie's Lab",
      comment: 'New issue: ASAP',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });
    appointment.attributes.sta6aid = null;

    mockAppointmentInfo({
      va: [appointment],
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
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: moment().subtract(1, 'day'),
      locationId: '983GC',
      clinicFriendlyName: "Jennie's Lab",
      comment: 'New issue: ASAP',
      stopCode: '323',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: '970-224-1550',
        version: 0,
      }),
      version: 0,
    });
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

    expect(screen.getByText(/Primary care/i)).to.be.ok;
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
    // Given a veteran has VA appointments
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
      clinicName: 'CHY OPT VAR1',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

    const cancelReason = getCancelReasonMock();
    cancelReason.attributes = { ...cancelReason.attributes, number: '5' };
    mockVACancelFetches('983', [cancelReason]);
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
    });
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    const detailLink = detailLinks.find(l => l.getAttribute('href') === url);

    // And select an appointment details link
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

    // When the user clicks on cancel appointment link
    userEvent.click(screen.getByText(/cancel appointment/i));
    await screen.findByRole('alertdialog');
    expect(window.dataLayer[15]).to.deep.equal({
      event: 'vaos-cancel-booked-clicked',
    });
    //  And clicks on 'yes, cancel this appointment' to confirm
    userEvent.click(screen.getByText(/yes, cancel this appointment/i));

    // Then it should display appointment is canceled
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
    // expect(screen.baseElement).to.contain.text(
    //   'You canceled this appointment.',
    // );
  });

  it('should not allow cancellation of COVID-19 vaccine appointments', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'FUTURE',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
      serviceType: 'covid',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

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
      'Contact this facility if you need to reschedule or cancel your',
    );
  });

  it('should display who canceled the appointment', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'CANCELLED BY CLINIC',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

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
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      currentStatus: 'CANCELLED BY CLINIC',
      kind: 'clinic',
      clinic: '308',
      start: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DDThh:mm:[00Z]'),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });
    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

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
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
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
    // const data = {};
    const appointment = createMockAppointmentByVersion({
      version: 0,
      // ...data,
    });

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
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({ va: [appointment] });

    mockSingleAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

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
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: '308',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockSingleAppointmentFetch({ appointment });
    mockAppointmentInfo({
      va: [appointment],
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        version: 0,
      }),
      version: 0,
    });

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
    const startDateTime = moment();
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: 'fake',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Fort Collins VA Clinic',
        phone: '970-224-1550',
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${moment(startDateTime)
          .tz('America/Denver')
          .format('dddd, MMMM D, YYYY')}`,
      );
    });

    const ics = decodeURIComponent(
      screen
        .getByRole('link', {
          name: `Add ${moment(startDateTime)
            .tz('America/Denver')
            .format('MMMM D, YYYY')} appointment to your calendar`,
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
    expect(tokens.get('SUMMARY')).to.equal(
      'Appointment at Fort Collins VA Clinic',
    );

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      'You have a health care appointment at Fort Collins VA Clinic',
    );
    expect(description[1]).to.equal('\t\\n\\nFake street\\n');
    expect(description[2]).to.equal('\tFake city\\, FA fake zip\\n');
    expect(description[3]).to.equal('\t970-224-1550\\n');
    expect(description[4]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(description[5]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal(
      'Fake street\\, Fake city\\, FA fake zip',
    );
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(startDateTime)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${startDateTime
        .clone()
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });

  it('should verify VA phone calendar ics file format', async () => {
    const url = '/va/22cdc6741c00ac67b6cbf6b972d084c0';
    const data = {
      id: '22cdc6741c00ac67b6cbf6b972d084c0',
      kind: 'phone',
      clinic: 'fake',
      start: moment(),
      locationId: '983GC',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        version: 0,
      }),
      version: 0,
    });

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
    const tokens = getICSTokens(ics);

    expect(tokens.get('BEGIN')).includes('VCALENDAR');
    expect(tokens.get('VERSION')).to.equal('2.0');
    expect(tokens.get('PRODID')).to.equal('VA');
    expect(tokens.get('BEGIN')).includes('VEVENT');
    expect(tokens.has('UID')).to.be.true;
    expect(tokens.get('SUMMARY')).to.equal('Phone appointment');

    // Description text longer than 74 characters should start on newline beginning
    // with a tab character
    let description = tokens.get('DESCRIPTION');
    description = description.split(/(?=\t)/g); // look ahead include the split character in the results

    expect(description[0]).to.equal(
      `A provider will call you at ${moment(appointment.start)
        .tz('America/Denver')
        .format('h:mm a')}`,
    );
    expect(description[1]).to.equal('\t\\n\\nCheyenne VA Medical Center');
    expect(description[2]).to.equal('\t\\nFake street\\n');
    expect(description[3]).to.equal('\tFake city\\, FA fake zip\\n');
    expect(description[4]).to.equal('\t970-224-1550\\n');
    expect(description[5]).to.equal(
      '\t\\nSign in to https://va.gov/health-care/schedule-view-va-appointments/appo',
    );
    expect(description[6]).to.equal(
      '\tintments to get details about this appointment\\n',
    );
    expect(tokens.get('LOCATION')).to.equal('Phone call');
    expect(tokens.get('DTSTAMP')).to.equal(
      `${moment(appointment.start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTSTART')).to.equal(
      `${moment(appointment.start)
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('DTEND')).to.equal(
      `${moment(appointment.start)
        .add(60, 'minutes')
        .utc()
        .format('YYYYMMDDTHHmmss[Z]')}`,
    );
    expect(tokens.get('END')).includes('VEVENT');
    expect(tokens.get('END')).includes('VCALENDAR');
  });

  it('should show facility specific timezone when available', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    const today = moment.utc();

    const data = {
      id: '21cdc6741c00ac67b6cbf6b972d084c1',
      kind: 'clinic',
      clinic: '308',
      start: today.format(),
      locationId: '437GJ',
    };
    const appointment = createMockAppointmentByVersion({
      version: 0,
      ...data,
    });

    mockAppointmentInfo({
      va: [appointment],
    });

    mockSingleAppointmentFetch({
      appointment,
    });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '437GJ',
        name: 'Facility in Denver time',
        phone: '970-224-1550',
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          today.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(
      screen.getByText(
        new RegExp(
          moment()
            .tz('America/Denver')
            .format('h:mm'),
          'i',
        ),
      ),
    ).to.exist;
    expect(screen.getByText(/Mountain time/i)).to.exist;
  });
});

describe('VAOS <ConfirmedAppointmentDetailsPage> with VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
    mockFacilitiesFetchByVersion();
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should show confirmed appointments detail page', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    const url = '/va/1234';
    const futureDate = moment.utc();

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'New Issue',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'booked',
    };

    mockSingleClinicFetchByVersion({
      clinicId: '455',
      locationId: '983GC',
      clinicName: 'Some fancy clinic name',
      version: 2,
    });
    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText('Primary care')).to.be.ok;
    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Some fancy clinic name/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: I have a headache/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          futureDate
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );
  });

  it('should show confirmed phone appointments detail page', async () => {
    // Given a booked phone appointment
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    // When fetching the specific appointment id
    const url = '/va/1234';
    const futureDate = moment(getTimezoneTestDate());

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'phone',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'New Issue',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'booked',
    };

    mockSingleClinicFetchByVersion({
      clinicId: '455',
      locationId: '983GC',
      clinicName: 'Some fancy clinic name',
      version: 2,
    });
    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    // Then it should show it is a phone appointment
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'VA appointment over the phone',
      }),
    ).to.be.ok;

    // And show display the instructions
    expect(
      screen.getByText(
        /Someone from your VA facility will call you at your phone number/i,
      ),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Some fancy clinic name/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: I have a headache/)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          futureDate
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );
  });

  it('should show who cancel phone appointments detail page', async () => {
    // Given a phone appointment
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    const url = '/va/1234';
    const futureDate = moment(getTimezoneTestDate());
    // When the appointment is canceled
    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'phone',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'New Issue',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'cancelled',
      cancelationReason: { coding: [{ code: 'pat' }] },
    };

    mockSingleClinicFetchByVersion({
      clinicId: '455',
      locationId: '983GC',
      clinicName: 'Some fancy clinic name',
      version: 2,
    });
    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    expect(screen.getByText('Primary care')).to.be.ok;

    // Then it should display who canceled the appointment
    expect(await screen.findByText(/You canceled this appointment./i)).to.exist;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'VA appointment over the phone',
      }),
    ).to.be.ok;

    // And it should not show phone instruction
    expect(
      screen.queryByText(
        /Someone from your VA facility will call you at your phone number/i,
      ),
    ).to.not.to.exist;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Some fancy clinic name/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New issue: I have a headache/)).to.be.ok;

    // And it should not display the add to calendar link
    expect(
      screen.queryByRole('link', {
        name: new RegExp(
          futureDate
            .tz('America/Denver')
            .format('[Add] MMMM D, YYYY [appointment to your calendar]'),
          'i',
        ),
      }),
    ).to.not.be.ok;

    // And it should not display the print link
    expect(screen.queryByRole(/Print/)).to.not.be.ok;
    expect(screen.queryByRole(/Cancel appointment/)).to.not.be.ok;

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );
  });

  it('should show details without clinic name when clinic call fails', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    const url = '/va/1234';
    const futureDate = moment.utc();

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'New Issue',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'booked',
    };

    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(screen.queryByText(/clinic:/)).to.not.exist;
  });

  it('should show confirmation message if redirected from new appointment submit', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingFacilitiesServiceV2: true,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    const url = '/va/1234?confirmMsg=true';
    const futureDate = moment.utc();

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'booked',
    };

    mockSingleClinicFetchByVersion({
      clinicId: '455',
      locationId: '983GC',
      clinicName: 'Some fancy clinic name',
      version: 2,
    });
    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '983GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        phone: '970-224-1550',
      }),
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;

    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'We’ve scheduled and confirmed your appointment.',
    );
    expect(screen.baseElement).to.contain.text('Review your appointments');
    expect(screen.baseElement).to.contain.text('Schedule a new appointment');
  });

  it('should allow for cancellation', async () => {
    // Given a veteran has a VA appointments
    // And has VAOS Service flag
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
    };
    // And has pulled up the specific VA appointment
    const url = '/va/1234';
    const futureDate = moment.utc();

    const appointment = getVAOSAppointmentMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      kind: 'clinic',
      clinic: '455',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'New Issue',
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      start: futureDate.format(),
      status: 'booked',
    };

    mockSingleClinicFetchByVersion({
      clinicId: '455',
      locationId: '983GC',
      clinicName: 'Some fancy clinic name',
      version: 2,
    });
    mockSingleVAOSAppointmentFetch({ appointment });
    mockAppointmentCancelFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '442GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        version: 0,
      }),
      version: 0,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: myInitialState,
      path: url,
    });

    // Verify document content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(
          futureDate.tz('America/Denver').format('dddd, MMMM D, YYYY'),
          'i',
        ),
      }),
    ).to.be.ok;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.getByText(/Cancel appointment/)).to.be.ok;

    // When the veteran clicks on the cancel appointment link
    userEvent.click(screen.getByText(/cancel appointment/i));

    await screen.findByRole('alertdialog');

    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-cancel-booked-clicked',
    });
    // And click on 'yes, cancel this appointment' to confirm
    userEvent.click(screen.getByText(/yes, cancel this appointment/i));

    // Then it should display the appointment is canceled
    await screen.findByText(/your appointment has been canceled/i);
  });
});
