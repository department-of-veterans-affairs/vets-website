import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';
import { mockFetch } from 'platform/testing/unit/helpers';

import {
  mockMessagesFetch,
  mockAppointmentInfo,
  mockRequestCancelFetch,
  mockCCSingleProviderFetch,
  mockSingleRequestFetch,
  mockFacilityFetch,
} from '../../mocks/helpers';
import {
  mockSingleVAOSRequestFetch,
  mockAppointmentCancelFetch,
} from '../../mocks/helpers.v2';

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
import { getVAOSRequestMock } from '../../mocks/v2';

const testDate = getTimezoneTestDate();

const initialState = {
  featureToggles: {
    vaOnlineSchedulingHomepageRefresh: true,
    vaOnlineSchedulingVAOSServiceRequests: false,
  },
};

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingHomepageRefresh: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
  },
};

describe('VAOS <RequestedAppointmentDetailsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
    mockFacilityFetch('vha_fake', getVAFacilityMock());
    mockMessagesFetch();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should render VA request details', async () => {
    const appointment = getVARequestMock();
    appointment.id = '1234';
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
    };

    mockSingleRequestFetch({ request: appointment });

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

    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time and date of this appointment are still to be determined.',
    );

    expect(screen.getByText('Cheyenne VA Medical Center')).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Pending primary care appointment',
    );
    expect(screen.baseElement).to.contain.text('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
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
    expect(screen.baseElement).to.contain.text('703-652-0000');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should go back to requests page when clicking top link', async () => {
    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

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

  it('should render CC request details', async () => {
    const ccAppointmentRequest = getCCRequestMock();
    ccAppointmentRequest.attributes = {
      ...ccAppointmentRequest.attributes,
      appointmentType: 'Audiology (hearing aid support)',
      bestTimetoCall: ['Morning'],

      ccAppointmentRequest: {
        preferredProviders: [
          {
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

    mockAppointmentInfo({
      requests: [ccAppointmentRequest],
      isHomepageRefresh: true,
    });

    const message = getMessageMock();
    message.attributes = {
      ...message.attributes,
      messageText: 'A message from the patient',
    };
    mockMessagesFetch('1234', [message]);

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

    // show alert message
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time and date of this appointment are still to be determined.',
    );

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
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText('A message from the patient')).to.be.ok;

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
    const appointment = getVARequestMock();
    const alertText =
      'The time and date of this appointment are still to be determined.';

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

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

    expect(screen.baseElement).to.contain.text(alertText);

    expect(screen.baseElement).not.to.contain.text('Canceled');

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
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).not.to.contain.text(alertText);
  });

  it('should show error message when single fetch errors', async () => {
    const appointment = getVARequestMock();

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
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    const ccAppointmentRequest = getCCRequestMock();

    ccAppointmentRequest.id = '1234';
    ccAppointmentRequest.attributes = {
      ...ccAppointmentRequest.attributes,
      appointmentType: 'Audiology (hearing aid support)',
      typeOfCareId: 'CCAUDHEAR',
    };

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
    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

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

  it('should display new appointment confirmation alert', async () => {
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    const ccAppointmentRequest = getCCRequestMock();

    ccAppointmentRequest.id = '1234';
    ccAppointmentRequest.attributes = {
      ...ccAppointmentRequest.attributes,
      appointmentType: 'Audiology (hearing aid support)',
      typeOfCareId: 'CCAUDHEAR',
    };

    // Verify VA pending
    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}?confirmMsg=true`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending VA primary care appointment`,
      );
    });
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );
    expect(screen.baseElement).to.contain.text('View your appointments');
    expect(screen.baseElement).to.contain.text('New appointment');

    // Verify CC pending appointment
    mockSingleRequestFetch({
      request: ccAppointmentRequest,
      type: 'cc',
    });

    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}?confirmMsg=true`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care audiology (hearing aid support) appointment`,
      );
    });
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );
    expect(screen.baseElement).to.contain.text('View your appointments');
    expect(screen.baseElement).to.contain.text('New appointment');
  });

  it('should handle error when cancelling', async () => {
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      appointmentType: 'Primary care',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    // missing cancel request mock
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

    expect(screen.baseElement).not.to.contain.text('Canceled');

    fireEvent.click(screen.getByText(/cancel request/i));

    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    await screen.findByText(/We couldn’t cancel your request/i);

    expect(screen.baseElement).not.to.contain.text('Canceled');
  });
});

describe('VAOS <RequestedAppointmentDetailsPage> with VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should render VA request details with a VAOS appointment', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'Routine Follow-up',
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(testDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    mockSingleVAOSRequestFetch({ request: appointment });

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
      phone: { main: '307-778-7550' },
    };

    mockFacilityFetch('vha_442GC', facility);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
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

    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time and date of this appointment are still to be determined.',
    );

    expect(screen.getByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Pending primary care appointment',
    );
    expect(screen.baseElement).to.contain.text('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.baseElement).to.contain.text('307-778-7550');
    expect(screen.baseElement).to.contain.text('Preferred type of appointment');
    expect(screen.baseElement).to.contain.text('Office visit');
    expect(screen.baseElement).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.attributes.requestedPeriods[0].start).format(
        'ddd, MMMM D, YYYY',
      )} in the afternoon`,
    );
    expect(screen.baseElement).to.contain.text(
      `${moment(appointment.attributes.requestedPeriods[1].start).format(
        'ddd, MMMM D, YYYY',
      )} in the afternoon`,
    );
    expect(screen.baseElement).to.contain.text('Follow-up/Routine');

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('veteranemailtest@va.gov');
    expect(screen.baseElement).to.contain.text('212-555-1212');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should render CC request details with a VAOS appointment', async () => {
    const ccAppointmentRequest = getVAOSRequestMock();
    ccAppointmentRequest.id = '1234';
    ccAppointmentRequest.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'cc',
      locationId: '983GC',
      id: '1234',
      practitioners: [{ id: { value: '123' } }],
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'Routine Follow-up',
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(testDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '203',
      start: null,
      status: 'proposed',
    };

    mockSingleVAOSRequestFetch({ request: ccAppointmentRequest });

    const ccProvider = {
      id: '123',
      type: 'provider',
      attributes: {
        address: {},
        caresitePhone: null,
        name: 'Atlantic Medical Care',
        lat: null,
        long: null,
        uniqueId: '123',
      },
    };
    mockCCSingleProviderFetch(ccProvider);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${ccAppointmentRequest.id}`,
    });

    // Verify page content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending audiology and speech appointment',
      }),
    ).to.be.ok;

    // show alert message
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time and date of this appointment are still to be determined.',
    );

    // Should be able to cancel appointment
    expect(
      screen.getByRole('button', {
        name: /Cancel request/,
      }),
    ).to.be.ok;
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
    expect(
      screen.getByText(
        `${moment(
          ccAppointmentRequest.attributes.requestedPeriods[1].start,
        ).format('ddd, MMMM D, YYYY')} in the afternoon`,
      ),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText('A message from the patient')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your contact details',
      }),
    ).to.be.ok;
    expect(screen.getByText('veteranemailtest@va.gov')).to.be.ok;
    expect(screen.getByText('Call morning')).to.be.ok;

    expect(screen.queryByText('Community Care')).not.to.exist;
    expect(screen.queryByText('Reason for appointment')).not.to.exist;
  });

  it('should allow cancellation', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'Routine Follow-up',
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      status: 'proposed',
    };

    mockSingleVAOSRequestFetch({ request: appointment });
    mockFacilityFetch('vha_442GC', getVAFacilityMock({ id: '442GC' }));

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;

    expect(screen.baseElement).not.to.contain.text('Canceled');
    mockAppointmentCancelFetch({ appointment });

    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    await screen.findByText(/your request has been canceled/i);
    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        // Looks for second appointments/1234 call, because first is GET, second is PUT
        .filter(call => call.args[0].endsWith('appointments/1234'))[1].args[1]
        .body,
    );
    expect(cancelData).to.deep.equal({
      status: 'cancelled',
    });

    fireEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should handle error when canceling', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reason: 'Routine Follow-up',
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      status: 'proposed',
    };

    mockSingleVAOSRequestFetch({ request: appointment });
    mockFacilityFetch('vha_442GC', getVAFacilityMock({ id: '442GC' }));

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;

    expect(screen.baseElement).not.to.contain.text('Canceled');
    mockAppointmentCancelFetch({ appointment, error: true });

    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));
    await screen.findByText(/We couldn’t cancel your request/i);

    expect(screen.baseElement).not.to.contain.text('Canceled');
  });
});
