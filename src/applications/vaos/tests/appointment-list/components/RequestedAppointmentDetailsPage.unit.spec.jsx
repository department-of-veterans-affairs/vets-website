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

describe('VAOS <RequestedAppointmentDetailsPage> using VAR Resouces API', () => {
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
    // Given a va request
    const appointment = getVARequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
      status: 'Submitted',
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
      visitType: 'Office Visit',
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
    // And has selected the facility
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
    // And entered a message
    mockFacilityFetch('vha_442GC', facility);
    const message = getMessageMock();
    message.attributes = {
      ...message.attributes,
      messageText: 'A message from the patient',
    };
    mockMessagesFetch('1234', [message]);
    // When the page displays the request detail based on the id
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
    // Then the page title is shown
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending primary care appointment',
      }),
    );
    // And the alert message is displayed
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time And date of this appointment are still to be determined.',
    );
    // And the facility detail is shown
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text(
      'Pending primary care appointment',
    );
    expect(screen.baseElement).to.contain.text('VA appointment');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('2360 East Pershing Boulevard');
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    // And the veteran contact information is displayed
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.baseElement).to.contain.text('307-778-7550');
    // And preferred appointment dates And times are shown
    expect(screen.baseElement).to.contain.text('Preferred date And time');
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

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred type of appointment',
      }),
    ).to.be.ok;

    expect(screen.baseElement).to.contain.text('Office visit');

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    // And veteran message is displayed

    expect(screen.baseElement).to.contain.text('New issue');
    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('patient.test@va.gov');
    expect(screen.baseElement).to.contain.text('703-652-0000');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should go back to requests page When clicking top link', async () => {
    // Given a veteran has VA a request appointment

    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    // When the page displays the appointment requests list
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });
    // Then it will display a link associated to each request
    const detailLinks = await screen.findAllByRole('link', {
      name: /Details/i,
    });
    // When the user clicks on the link
    fireEvent.click(detailLinks[0]);
    // Then it will display the pending appointment details page
    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    // When the breadcrumb link is clicked
    fireEvent.click(screen.getByText('VA online scheduling'));
    // Then it will bring user back to the VOAS homepage
    expect(screen.history.push.lastCall.args[0]).to.equal('/');
  });

  it('should render CC request details', async () => {
    // Given a veteran has CC request appointment
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
      typeOfCareId: 'CCAUDHEAR',
    };

    ccAppointmentRequest.id = '1234';

    mockAppointmentInfo({
      requests: [ccAppointmentRequest],
      isHomepageRefresh: true,
    });
    // And has entered a message
    const message = getMessageMock();
    message.attributes = {
      ...message.attributes,
      messageText: 'A message from the patient',
    };
    mockMessagesFetch('1234', [message]);
    // When the page displays the requested list
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });
    // Then it will display a link associated to each request
    const detailLinks = await screen.findAllByRole('link', {
      name: /Detail/i,
    });
    // When the user clicks on the first link
    fireEvent.click(detailLinks[0]);

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
    // Then it will display the pending appointment details page
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending hearing aid support appointment',
      }),
    ).to.be.ok;

    // And show the alert message
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time And date of this appointment are still to be determined.',
    );
    // And show the request appointment details
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
        name: 'Preferred date And time',
      }),
    ).to.be.ok;
    expect(screen.getByText('Fri, February 21, 2020 in the morning')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;

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
    // And show the cancel button
    expect(screen.getByRole('button', { name: /Cancel request/ })).to.be.ok;
  });

  it('should allow cancellation', async () => {
    // Given a veteran has VA a request appointment
    const appointment = getVARequestMock();
    const alertText =
      'The time And date of this appointment are still to be determined.';

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
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
    // When the user clicks on the cancel button
    fireEvent.click(screen.getByText(/cancel request/i));
    // Then the alert message displays
    await screen.findByRole('alertdialog');
    // When the user clicks the yes
    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    await screen.findByText(/your request has been canceled/i);
    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].endsWith('appointment_requests/1234'))
        .args[1].body,
    );
    // Then it will update the status to be cancelled
    expect(cancelData).to.deep.equal({
      ...appointment.attributes,
      id: '1234',
      appointmentRequestDetailCode: ['DETCODE8'],
      status: 'Cancelled',
    });
    // When the user clicks on continue button
    fireEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    // Then canceled will be shown
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).not.to.contain.text(alertText);
  });

  it('should show error message When single fetch errors', async () => {
    // Given a error with the fetch

    const appointment = getVARequestMock();

    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
      error: true,
    });
    // When the page displays the request detail based on the id
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
    // Then it will show the error message
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'We’re sorry. We’ve run into a problem',
      }),
    ).to.be.ok;
  });

  it('should display pending document title', async () => {
    // Given there is a request
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
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

    // And it is a VA request
    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
    });
    // When fetching the request based on the id
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });
    // Then it displays VA request in the docuemnt title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending VA primary care appointment`,
      );
    });

    // Given request is CC
    mockSingleRequestFetch({
      request: ccAppointmentRequest,
      type: 'cc',
    });
    // When fetching the request based on the id
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });
    // Then it displays CC request in the docuemnt title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care hearing aid support appointment`,
      );
    });
  });

  it('should display cancel document title', async () => {
    // Given there is a canceled VA request

    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    const canceledAppointment = { ...appointment };
    canceledAppointment.attributes = {
      ...canceledAppointment.attributes,
      status: 'Cancelled',
    };
    mockSingleRequestFetch({
      request: canceledAppointment,
      type: 'va',
    });
    // When it fetches the request by the id
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}`,
    });
    // Then it displays the cancel VA request in the document title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Canceled VA primary care appointment`,
      );
    });
  });

  it('should display new appointment confirmation alert', async () => {
    // Given an appointment request
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
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

    // And is a VA request
    mockSingleRequestFetch({
      request: appointment,
      type: 'va',
    });
    // When fetching the newly created VA request
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}?confirmMsg=true`,
    });
    // Then it displays the document title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending VA primary care appointment`,
      );
    });
    // And the success message
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request And contact you to schedule the first available appointment.',
    );
    expect(screen.baseElement).to.contain.text('View your appointments');
    expect(screen.baseElement).to.contain.text('New appointment');

    // Given it is a CC request
    mockSingleRequestFetch({
      request: ccAppointmentRequest,
      type: 'cc',
    });
    // When fetching the newly created CC request
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/requests/${appointment.id}?confirmMsg=true`,
    });
    // Then it displays the document title
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care hearing aid support appointment`,
      );
    });
    // And the success message
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request And contact you to schedule the first available appointment.',
    );
    expect(screen.baseElement).to.contain.text('View your appointments');
    expect(screen.baseElement).to.contain.text('New appointment');
  });

  it('should handle error When cancelling', async () => {
    // Given a request
    const appointment = getVARequestMock();

    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });
    // And missing cancel request mock
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
    // When user clicks the cancel button
    fireEvent.click(screen.getByText(/cancel request/i));

    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));
    // Then cannot cancel message will display
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
    // Given a veteran has VA request appointment
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
      reason: 'New Issue',
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
    // When fetcing the request by id
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });

    // Then it displays the request details
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
      'The time And date of this appointment are still to be determined.',
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
    expect(screen.baseElement).to.contain.text('Preferred date And time');
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
    expect(screen.baseElement).to.contain.text('New issue');

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('veteranemailtest@va.gov');
    expect(screen.baseElement).to.contain.text('212-555-1212');
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should render CC request details with a VAOS appointment', async () => {
    // Given a CC request
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
      reason: 'New Issue',
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
    // When fetching the request by id
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${ccAppointmentRequest.id}`,
    });

    // Then it displays the request details page
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Pending audiology And speech appointment',
      }),
    ).to.be.ok;

    // And shows alert message
    expect(screen.baseElement).to.contain('.usa-alert-info');
    expect(screen.baseElement).to.contain.text(
      'The time And date of this appointment are still to be determined.',
    );

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
        name: 'Preferred date And time',
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
    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;

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
    // And shows cancel button
    expect(
      screen.getByRole('button', {
        name: /Cancel request/,
      }),
    ).to.be.ok;
  });

  it('should allow cancellation', async () => {
    // Given a VA request
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
    // When fetcing request by id
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });
    // Then it displays the details
    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    // And the cancel button
    expect(screen.baseElement).not.to.contain.text('Canceled');
    mockAppointmentCancelFetch({ appointment });
    // When user clicks on the cancel button
    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));
    // Then it makes a put call the request
    await screen.findByText(/your request has been canceled/i);
    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        // Looks for second appointments/1234 call, because first is GET, second is PUT
        .filter(call => call.args[0].endsWith('appointments/1234'))[1].args[1]
        .body,
    );
    // And updates the status to cancel
    expect(cancelData).to.deep.equal({
      status: 'cancelled',
    });

    fireEvent.click(screen.getByText(/continue/i));

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should handle error When canceling', async () => {
    // Given a request
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
    // And an error is returned from the fetch
    mockAppointmentCancelFetch({ appointment, error: true });

    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');
    // When user clicks the cancel button
    fireEvent.click(screen.getByText(/yes, cancel this request/i));
    // Then display the error message
    await screen.findByText(/We couldn’t cancel your request/i);

    expect(screen.baseElement).not.to.contain.text('Canceled');
  });
});
