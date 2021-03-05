import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import {
  getVAAppointmentMock,
  getVAFacilityMock,
  getCancelReasonMock,
} from '../../mocks/v0';
import {
  mockAppointmentInfo,
  mockFacilitiesFetch,
  mockFacilityFetch,
  mockSingleAppointmentFetch,
  mockVACancelFetches,
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

const appointment = getVAAppointmentMock();
appointment.attributes = {
  ...appointment.attributes,
  clinicId: '308',
  clinicFriendlyName: "Jennie's Lab",
  facilityId: '983',
  sta6aid: '983GC',
  communityCare: false,
  vdsAppointments: [
    {
      bookingNote: 'New issue: ASAP',
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

const facility = {
  id: 'vha_442GC',
  attributes: {
    ...getVAFacilityMock().attributes,
    type: 'facility',
    address: {
      mailing: {},
      physical: {
        zip: '80526-8108',
        city: 'Fort Collins',
        state: 'CO',
        address1: '2509 Research Boulevard',
        address2: null,
        address3: null,
      },
    },
    id: 'vha_442GC',
    name: 'Fort Collins VA Clinic',
    phone: {
      main: '970-224-1550',
    },
    uniqueId: '442GC',
  },
};

describe('VAOS <ConfirmedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
    appointment.attributes.startDate = moment();
    mockAppointmentInfo({
      va: [appointment],
      cc: [],
      requests: [],
      isHomepageRefresh: true,
    });

    mockFacilitiesFetch('vha_442GC', [facility]);
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should show confirmed appointments detail page', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
    mockSingleAppointmentFetch({
      appointment,
      type: 'va',
    });

    mockFacilityFetch('vha_442GC', facility);
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

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
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(screen.getByRole('heading', { level: 5, name: /New issue/ })).to.be
      .ok;
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
    expect(screen.getByRole('link', { name: /Reschedule/ })).to.be.ok;

    const button = screen.getByRole('button', {
      name: /Go back to appointments/,
    });
    expect(button).to.be.ok;

    // Verify back button works...
    userEvent.click(button);
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

  it('should allow cancellation', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';
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
    expect(screen.baseElement).to.contain.text('canceled');
  });

  it('should fire a print request when print button clicked', async () => {
    const url = '/va/21cdc6741c00ac67b6cbf6b972d084c1';

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
    mockSingleAppointmentFetch({
      appointment,
      type: 'va',
      error: true,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: url,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });
});
