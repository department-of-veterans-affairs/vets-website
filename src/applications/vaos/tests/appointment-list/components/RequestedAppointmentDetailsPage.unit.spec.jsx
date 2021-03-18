import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import {
  mockMessagesFetch,
  mockAppointmentInfo,
  mockRequestCancelFetch,
  mockSingleRequestFetch,
  mockFacilityFetch,
} from '../../mocks/helpers';

import { AppointmentList } from '../../../appointment-list';
import {
  getTimezoneTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import {
  getVAFacilityMock,
  getVARequestMock,
  getCCRequestMock,
  getMessageMock,
} from '../../mocks/v0';

const testDate = getTimezoneTestDate();

const appointment = getVARequestMock();
appointment.attributes = {
  ...appointment.attributes,
  typeOfCareId: '323',
  status: 'Submitted',
  appointmentType: 'Primary care',
  optionDate1: moment(testDate)
    .add(3, 'days')
    .format('MM/DD/YYYY'),
  optionTime1: 'AM',
  optionDate2: moment(testDate)
    .add(4, 'days')
    .format('MM/DD/YYYY'),
  optionTime2: 'AM',
  optionDate3: moment(testDate)
    .add(5, 'days')
    .format('MM/DD/YYYY'),
  optionTime3: 'PM',
  facility: {
    ...getVARequestMock().attributes.facility,
    facilityCode: '983GC',
  },
  bestTimetoCall: ['Morning'],
  purposeOfVisit: 'New Issue',
  email: 'patient.test@va.gov',
  phoneNumber: '(703) 652-0000',
  friendlyLocationName: 'Some facility name',
};

appointment.id = '1234';

const ccAppointmentRequest = getCCRequestMock();
ccAppointmentRequest.attributes = {
  ...ccAppointmentRequest.attributes,
  appointmentType: 'Audiology (hearing aid support)',
  bestTimetoCall: ['Morning'],

  ccAppointmentRequest: {
    preferredProviders: [
      {
        address: {
          city: 'Orlando',
          state: 'FL',
          street: '123 Main Street',
          zipCode: '32826',
        },
        practiceName: 'Atlantic Medical Care',
      },
    ],
  },

  email: 'joe.blow@va.gov',
  optionDate1: '02/21/2020',
  optionTime1: 'AM',
  purposeOfVisit: 'routine-follow-up',
  typeOfCareId: 'CCAUDHEAR',
};

ccAppointmentRequest.id = '1234';

const facility = getVAFacilityMock();
facility.attributes = {
  ...facility.attributes,
  id: 'vha_442GC',
  uniqueId: '442GC',
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
};

const initialState = {
  featureToggles: {
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <RequestedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
  });

  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should render VA request details', async () => {
    mockSingleRequestFetch({ request: appointment });
    mockFacilityFetch('vha_442GC', facility);
    const message = getMessageMock();
    message.attributes = {
      ...message.attributes,
      messageText: 'A message from the patient',
    };
    mockMessagesFetch('1234', [message]);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    // Verify page content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending primary care appointment',
      }),
    );

    expect(screen.getByText('Cheyenne VA Medical Center')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Pending primary care appointment',
    );
    expect(screen.baseElement).to.contain.text('VA Appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.baseElement).to.contain.text('307-778-7550');
    expect(screen.baseElement).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.attributes.optionDate1).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.attributes.optionDate2).format(
        'ddd, MMMM D, YYYY',
      )} in the morning`,
    );
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.attributes.optionDate3).format(
        'ddd, MMMM D, YYYY',
      )} in the afternoon`,
    );
    expect(screen.baseElement).to.contain.text('New issue');

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('patient.test@va.gov');
    expect(screen.baseElement).to.contain.text('(703) 652-0000');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should go back to requests page when clicking top link', async () => {
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    fireEvent.click(detailLinks[0]);

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;

    fireEvent.click(screen.getByText('VA online scheduling'));
    expect(screen.history.push.lastCall.args[0]).to.equal('/');
  });

  it('should go back to requests page when clicking go back to appointments button', async () => {
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    fireEvent.click(detailLinks[0]);

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    fireEvent.click(await screen.findByText(/Go back to appointments/));
    expect(screen.history.push.lastCall.args[0]).to.equal('/requested');
  });

  it('should render CC request details', async () => {
    mockAppointmentInfo({
      requests: [ccAppointmentRequest],
      isHomepageRefresh: true,
    });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    fireEvent.click(detailLinks[0]);

    // Verify page content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending audiology (hearing aid support) appointment',
      }),
    ).to.be.ok;

    // Should be able to cancel appointment
    expect(screen.getByRole('button', { name: /Cancel request/ })).to.be.ok;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred community care provider',
      }),
    ).to.be.ok;
    expect(screen.getByText('Atlantic Medical Care')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;
    expect(screen.getByText('Fri, February 21, 2020 in the morning')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Follow-up/Routine',
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your contact details',
      }),
    ).to.be.ok;
    expect(screen.getByText('joe.blow@va.gov')).to.be.ok;
    expect(screen.getByText('Call morning')).to.be.ok;

    expect(screen.queryByText('Community Care')).not.to.exist;
    expect(screen.queryByText('Reason for appointment')).not.to.exist;
  });

  it('should allow cancellation', async () => {
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    mockRequestCancelFetch(appointment);
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });

    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });

    fireEvent.click(detailLinks[0]);

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;

    expect(screen.baseElement).not.to.contain.text('canceled');

    fireEvent.click(screen.getByText(/cancel request/i));

    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    await screen.findByText(/your request has been canceled/i);

    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].endsWith('appointment_requests/1234'))
        .args[1].body,
    );

    expect(cancelData).to.deep.equal({
      ...appointment.attributes,
      id: '1234',
      appointmentRequestDetailCode: ['DETCODE8'],
      status: 'Cancelled',
    });

    fireEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text('canceled');
  });

  it('should show error message when single fetch errors', async () => {
    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
      error: true,
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });

  it('should display pending document title', async () => {
    // Verify VA pending
    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
    });

    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending VA primary care appointment`,
      );
    });

    // Verify CC pending appointment
    mockSingleRequestFetch({
      request: ccAppointmentRequest,
      type: 'cc',
    });

    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care audiology (hearing aid support) appointment`,
      );
    });
  });

  it('should display cancel document title', async () => {
    // Verify cancel VA appt
    const canceledAppointment = { ...appointment };
    canceledAppointment.attributes = {
      ...canceledAppointment.attributes,
      status: 'Cancelled',
    };
    mockSingleRequestFetch({
      request: canceledAppointment,
      type: 'va',
    });
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Canceled VA primary care appointment`,
      );
    });
  });
});
