import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
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
    resetFetch();
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

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Fort Collins VA Clinic/)).to.be.ok;
    expect(screen.getByText(/Jennie's Lab/)).to.be.ok;
    expect(screen.getByRole('link', { name: /9 7 0. 2 2 4. 1 5 5 0./ })).to.be
      .ok;
    expect(screen.getByRole('heading', { level: 2, name: /New issue/ })).to.be
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
});
