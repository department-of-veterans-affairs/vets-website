import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  mockAppointmentInfo,
  mockCCSingleProviderFetch,
  mockSingleRequestFetch,
} from '../../mocks/helpers';
import {
  mockSingleVAOSRequestFetch,
  mockAppointmentCancelFetch,
} from '../../mocks/helpers.v2';

import { AppointmentList } from '../../../appointment-list';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import { getVARequestMock, getCCRequestMock } from '../../mocks/v0';
import { getVAOSRequestMock } from '../../mocks/v2';
import { createMockFacilityByVersion } from '../../mocks/data';
import { mockFacilityFetchByVersion } from '../../mocks/fetch';

const testDate = getTestDate();

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVAOSServiceRequests: false,
  },
};

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: false,
  },
};

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
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
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

    const facility = createMockFacilityByVersion({
      id: '983GC',
      name: 'Cheyenne VA Medical Center',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
      phone: '307-778-7550',
    });

    mockFacilityFetchByVersion({ facility });

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
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.baseElement).to.contain.text('Preferred type of appointment');
    expect(screen.baseElement).to.contain.text('Office visit');
    expect(screen.baseElement).to.contain.text('Preferred date and time');

    const start = moment(
      appointment.attributes.requestedPeriods[0].start,
      'YYYY-MM-DDTHH:mm:ss',
    );

    expect(screen.baseElement).to.contain.text(
      `${start.format('ddd, MMMM D, YYYY')} ${
        start.isBetween(
          moment(start).hour(0),
          moment(start).hour(12),
          'hour',
          '[)',
        )
          ? 'in the morning'
          : 'in the afternoon'
      }`,
    );

    const start1 = moment(
      appointment.attributes.requestedPeriods[1].start,
      'YYYY-MM-DDTHH:mm:ss',
    );

    expect(screen.baseElement).to.contain.text(
      `${start1.format('ddd, MMMM D, YYYY')} ${
        start1.isBetween(
          moment(start1).hour(0),
          moment(start1).hour(12),
          'hour',
          '[)',
        )
          ? 'in the morning'
          : 'in the afternoon'
      }`,
    );

    expect(screen.baseElement).to.contain.text('New medical issue');

    expect(await screen.findByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('veteranemailtest@va.gov');
    expect(screen.getByTestId('patient-telephone')).to.exist;
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
      practitioners: [{ identifier: [{ value: '123' }] }],
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
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
    // Need to re-vist this when we update our v2 cypress tests
    // expect(screen.getByText(/Type of care/)).to.be.ok;
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

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;

    const start1 = moment(
      ccAppointmentRequest.attributes.requestedPeriods[1].start,
      'YYYY-MM-DDTHH:mm:ss',
    );

    expect(screen.baseElement).to.contain.text(
      `${start1.format('ddd, MMMM D, YYYY')} ${
        start1.isBetween(
          moment(start1).hour(0),
          moment(start1).hour(12),
          'hour',
          '[)',
        )
          ? 'in the morning'
          : 'in the afternoon'
      }`,
    );

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
  });

  it('should render CC request details using NPI with a VAOS appointment', async () => {
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
      practitioners: [{ identifier: [{ value: '1801312053' }] }],
      preferredTimesForPhoneCall: ['Morning'],
      preferredProviderName: 'AJADI, ADEDIWURA',
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
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
    const facility = createMockFacilityByVersion({ id: '983GC' });

    mockFacilityFetchByVersion({ facility });
    const store = createTestStore({
      featureToggles: {
        vaOnlineSchedulingVAOSServiceRequests: true,
        vaOnlineSchedulingVAOSServiceCCAppointments: true,
      },
    });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      store,
      path: `/requests/${ccAppointmentRequest.id}`,
    });

    // Verify page content...
    await waitFor(() => {
      expect(store.getState().appointments.appointmentDetailsStatus).to.equal(
        'succeeded',
      );
      // expect(document.activeElement).to.have.tagName('h1');
    });

    // Need to re-vist this when we update our v2 cypress tests
    // expect(screen.getByText(/Type of care/)).to.be.ok;
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
    expect(screen.getByText('AJADI, ADEDIWURA')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;

    const start1 = moment(
      ccAppointmentRequest.attributes.requestedPeriods[1].start,
      'YYYY-MM-DDTHH:mm:ss',
    );

    expect(screen.baseElement).to.contain.text(
      `${start1.format('ddd, MMMM D, YYYY')} ${
        start1.isBetween(
          moment(start1).hour(0),
          moment(start1).hour(12),
          'hour',
          '[)',
        )
          ? 'in the morning'
          : 'in the afternoon'
      }`,
    );

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
  });

  it('should allow cancellation', async () => {
    // Given a veteran has a VA request
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
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
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
    mockAppointmentCancelFetch({ appointment });
    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({ id: '983GC' }),
    });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;

    expect(screen.baseElement).not.to.contain.text('Canceled');
    mockAppointmentCancelFetch({ appointment });

    // When user clicks on cancel request link
    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-cancel-request-clicked',
    });

    // And clicks on 'yes, cancel this request' to confirm
    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    // Then is should display request is canceled
    await screen.findByTestId('cancel-request-SuccessModal');
    const cancelData = JSON.parse(
      global.fetch
        .getCalls()
        .filter(call => call.args[0].endsWith('appointments/1234'))[0].args[1]
        .body,
    );
    expect(cancelData).to.deep.equal({
      status: 'cancelled',
    });
    expect(
      screen
        .queryByTestId('cancel-request-SuccessModal')
        .getAttribute('primaryButtonText'),
    ).to.eq('Continue');
    const continueBtn = screen.queryByTestId('cancel-request-SuccessModal')
      .__events.primaryButtonClick;
    await continueBtn();

    expect(screen.baseElement).to.contain.text('You canceled this request');
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
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
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
    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({ id: '983GC' }),
      version: 0,
    });
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
    await screen.findByTestId('cancel-request-SuccessModal');

    expect(screen.baseElement).not.to.contain.text('Canceled');
  });

  it('should render CC request with correct requested dates', async () => {
    const ccAppointmentRequest = getVAOSRequestMock();
    ccAppointmentRequest.id = '1234';

    ccAppointmentRequest.attributes = {
      cancellable: true,
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
      practitioners: [{ identifier: [{ value: '123' }] }],
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: `${moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DD')}T00:00:00Z`,
        },
        {
          start: `${moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DD')}T12:00:00Z`,
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

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;

    expect(
      screen.getByText(
        `${moment(
          ccAppointmentRequest.attributes.requestedPeriods[0].start.replace(
            'Z',
            '',
          ),
        ).format('ddd, MMMM D, YYYY')} in the morning`,
      ),
    ).to.be.ok;

    expect(
      screen.getByText(
        `${moment(
          ccAppointmentRequest.attributes.requestedPeriods[1].start.replace(
            'Z',
            '',
          ),
        ).format('ddd, MMMM D, YYYY')} in the afternoon`,
      ),
    ).to.be.ok;
  });

  // ---------------------
  it.skip('should go back to requests page when clicking top link', async () => {
    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
      optionDate1: moment(testDate)
        .add(3, 'days')
        .format('MM/DD/YYYY'),
      optionTime1: 'AM',
    };

    mockAppointmentInfo({ requests: [appointment] });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/requested',
    });

    const detailLinks = await screen.findAllByTestId('appointment-detail-link');

    fireEvent.click(detailLinks[0]);

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    expect(
      screen.getByText('VA online scheduling').getAttribute('href'),
    ).to.equal('/');
  });

  it.skip('should show error message when single fetch errors', async () => {
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

  it.skip('should display pending document title', async () => {
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
        `Pending Community care hearing aid support appointment`,
      );
    });
  });

  it.skip('should display cancel document title', async () => {
    const appointment = getVARequestMock();

    appointment.attributes = {
      ...appointment.attributes,
      typeOfCareId: '323',
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
});
