import React from 'react';
import { expect } from 'chai';
import moment from 'moment-timezone';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_VISIT_ID,
} from '../../../../utils/constants';
import { renderWithStoreAndRouter, getTestDate } from '../../../mocks/setup';

import { AppointmentList } from '../../../../appointment-list';
import {
  mockAppointmentApi,
  mockAppointmentUpdateApi,
  mockClinicsApi,
  mockGetPendingAppointmentsApi,
  mockGetUpcomingAppointmentsApi,
  mockSingleVAOSAppointmentFetch,
} from '../../../mocks/helpers.v2';
import { getVAOSAppointmentMock } from '../../../mocks/v2';
import {
  mockFacilitiesFetchByVersion,
  mockFacilityFetchByVersion,
  mockSingleClinicFetchByVersion,
} from '../../../mocks/fetch';
import { createMockFacilityByVersion } from '../../../mocks/data';
import MockAppointmentResponse from '../../../e2e/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../e2e/fixtures/MockFacilityResponse';
import MockClinicResponse from '../../../e2e/fixtures/MockClinicResponse';

describe('VAOS Page: ConfirmedAppointmentDetailsPage with VAOS service', () => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      show_new_schedule_view_appointments_page: true,
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingPast: true,
      vaOnlineSchedulingRequests: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
    },
  };

  beforeEach(() => {
    mockFetch();
    mockFacilitiesFetchByVersion();
  });

  it.skip('should show confirmed appointments detail page', async () => {
    // Arrange
    const response = new MockAppointmentResponse();
    response
      .setLocationId('983')
      .setClinicId('1')
      .setReasonCode({ text: 'I have a headache' });
    const clinicResponse = new MockClinicResponse({ id: 1, locationId: '983' });
    const facilityResponse = new MockFacilityResponse({ id: '983' });

    mockAppointmentApi({ response });
    mockClinicsApi({
      clinicId: '1',
      locationId: '983',
      response: [clinicResponse],
    });
    mockFacilityFetchByVersion({ facility: facilityResponse });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
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

    expect(screen.getByText('Primary care')).to.be.ok;
    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Clinic 1/)).to.be.ok;
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/I have a headache/)).to.be.ok;
    expect(
      screen.getByTestId('add-to-calendar-link', {
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

    expect(screen.baseElement).not.to.contain.text(
      'This appointment occurred in the past.',
    );
  });

  it('should show confirmed phone appointments detail page', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      kind: TYPE_OF_VISIT_ID.phone,
    });
    response
      .setLocationId('983GC')
      .setClinicId('455')
      .setReasonCode({ text: 'I have a headache' });
    const clinicResponse = new MockClinicResponse({
      id: 455,
      locationId: '983GC',
      name: 'Some fancy clinic name',
    });
    const facilityResponse = new MockFacilityResponse({ id: '983GC' });

    mockAppointmentApi({ response });
    mockClinicsApi({
      clinicId: '455',
      locationId: '983GC',
      response: [clinicResponse],
    });
    mockFacilityFetchByVersion({ facility: facilityResponse });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/va/${response.id}`,
    });

    // Assert
    // Verify document title and content...
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
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
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/I have a headache/)).to.be.ok;
    expect(
      screen.getByTestId('add-to-calendar-link', {
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
    const futureDate = moment(getTestDate());
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
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'I have a headache',
      },
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      localStartTime: futureDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: futureDate.format(),
      status: 'cancelled',
      cancelationReason: { coding: [{ code: 'pat' }] },
      location: {
        id: '983GC',
        type: 'appointments',
        attributes: {
          id: '983GC',
          vistaSite: '983GC',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },
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
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      }),
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
        name: new RegExp(futureDate.format('dddd, MMMM D, YYYY'), 'i'),
      }),
    ).to.be.ok;

    expect(screen.getByText('Primary care')).to.be.ok;

    // Then it should display who canceled the appointment
    expect(await screen.findByText(/You canceled your appointment/i)).to.exist;

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
    ).to.be.null;

    // NOTE: This 2nd 'await' is needed due to async facilities fetch call!!!

    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(await screen.findByText(/Some fancy clinic name/)).to.be.ok;
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(screen.getByText(/New medical issue: I have a headache/)).to.be.ok;

    // And it should not display the add to calendar link
    expect(screen.queryByTestId('add-to-calendar-link')).to.be.null;

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
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'I have a headache',
      },
      comment: 'New issue: I have a headache',
      serviceType: 'primaryCare',
      localStartTime: futureDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: futureDate.format(),
      status: 'booked',
      cancellable: true,
    };

    mockSingleVAOSAppointmentFetch({ appointment });

    mockFacilityFetchByVersion({
      facility: createMockFacilityByVersion({
        id: '983GC',
        name: 'Cheyenne VA Medical Center',
        phone: '970-224-1550',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
      }),
    });

    mockClinicsApi({ clinicId: '455', locationId: '983GC', response: [] });

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
        name: new RegExp(futureDate.format('dddd, MMMM D, YYYY'), 'i'),
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
      localStartTime: futureDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      start: futureDate.format(),
      status: 'booked',
      cancellable: true,
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
        name: new RegExp(futureDate.format('dddd, MMMM D, YYYY'), 'i'),
      }),
    ).to.be.ok;
    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;

    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'We’ve scheduled and confirmed your appointment.',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;

    expect(
      screen.queryByTestId('review-appointments-link').getAttribute('text'),
    ).to.equal('Review your appointments');
    expect(
      screen.queryByTestId('schedule-appointment-link').getAttribute('text'),
    ).to.equal('Schedule a new appointment');
  });

  // -------------

  it('should show confirmed appointment without facility information', async () => {
    // Arrange
    const response = new MockAppointmentResponse();
    response.setReasonCode({ text: 'New issue: ASAP' });
    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
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
      screen.getByTestId('add-to-calendar-link', {
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
    // Arrange
    const now = moment().tz('America/Denver');
    const yesterday = moment(now).subtract(1, 'day');

    const response = new MockAppointmentResponse({
      localStartTime: yesterday,
    });
    response.setLocationId('983').setStart(yesterday);

    mockAppointmentApi({ response });
    mockFacilityFetchByVersion({
      facility: new MockFacilityResponse('983'),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `VA appointment on ${yesterday.format(
          'dddd, MMMM D, YYYY',
        )} | Veterans Affairs`,
      );
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(yesterday.format('dddd, MMMM D, YYYY'), 'i'),
      }),
    ).to.be.ok;

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(screen.baseElement).to.contain.text(
      'This appointment occurred in the past.',
    );

    expect(await screen.findByText(/Cheyenne VA Medical Center/)).to.be.ok;
    expect(screen.queryByTestId('add-to-calendar-link')).not.to.exist;
    expect(screen.getByText(/Print/)).to.be.ok;
    expect(screen.baseElement).not.to.contain.text('Cancel appointment');
  });

  it('should allow cancellation', async () => {
    // Arrange
    // Given a veteran has VA appointments
    const response = new MockAppointmentResponse();
    const canceledAppointmentResponse = new MockAppointmentResponse();
    canceledAppointmentResponse
      .setCancelationReason('pat')
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({ response: canceledAppointmentResponse });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(screen.baseElement).not.to.contain.text('canceled');

    // When the user clicks on cancel appointment link
    userEvent.click(screen.getByText(/cancel appointment/i));
    await screen.findByRole('alertdialog');

    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-cancel-booked-clicked',
    });

    //  And clicks on 'yes, cancel this appointment' to confirm
    userEvent.click(screen.getByText(/yes, cancel this appointment/i));

    // Then it should display appointment is canceled
    const modal = await screen.findByTestId('cancel-appointment-SuccessModal');
    const continueBtn = modal.__events.primaryButtonClick;
    await continueBtn();

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.contain.text(
      'You canceled your appointment.',
    );
  });

  it('should not allow cancellation of COVID-19 vaccine appointments', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      serviceType: 'covid',
      cancellable: false,
    });
    response.setLocationId('983');

    mockAppointmentApi({ response });
    mockFacilityFetchByVersion({
      facility: new MockFacilityResponse({ id: '983' }),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
    expect(await screen.findAllByText('COVID-19 vaccine')).to.exist;
    expect(screen.baseElement).not.to.contain.text('Cancel appointment');
    expect(screen.baseElement).to.contain.text(
      'Contact this facility if you need to reschedule or cancel your',
    );
  });

  it('should display who canceled the appointment', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.cancelled,
    });
    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // The canceled appointment and past appointment alerts are mutually exclusive
    // with the canceled appointment status having 1st priority. So, the canceled
    // appointment alert should display even when the appointment is a past
    // appointment.
    expect(screen.queryByText(/Facility canceled your appointment/i));
    expect(screen.queryByText('This appointment occurred in the past.')).not.to
      .exist;
  });

  it('should display who canceled the appointment for past appointments', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      localStartTime: moment().subtract(1, 'day'),
      status: APPOINTMENT_STATUS.cancelled,
    });

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    // The canceled appointment and past appointment alerts are mutually exclusive
    // with the canceled appointment status having 1st priority. So, the canceled
    // appointment alert should display even when the appointment is a past
    // appointment.
    expect(screen.queryByText(/Facility canceled your appointment/i));
    expect(screen.queryByText('This appointment occurred in the past.')).not.to
      .exist;
  });

  it('should fire a print request when print button clicked', async () => {
    // Arrange
    const oldPrint = global.window.print;
    const printSpy = sinon.spy();
    const response = new MockAppointmentResponse();

    global.window.print = printSpy;
    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    expect(printSpy.notCalled).to.be.true;
    fireEvent.click(await screen.findByText(/Print/i));
    expect(printSpy.calledOnce).to.be.true;

    global.window.print = oldPrint;
  });

  it('should show error message when single fetch errors', async () => {
    // Arrange
    mockAppointmentApi({
      response: new MockAppointmentResponse(),
      responseCode: 404,
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/1',
    });

    // Assert
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
    // Arrange
    const response = new MockAppointmentResponse();
    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    userEvent.click(screen.getByText(/cancel appointment/i));

    const button = document.querySelector('va-button');
    expect(button.getAttribute('text')).to.equal("No, don't cancel");
    button.click();

    expect(screen.queryByRole('alertdialog')).to.not.be.ok;
    expect(screen.baseElement).to.not.contain.text(
      'You canceled your appointment',
    );
  });

  it('should allow the user to go back to the appointment list', async () => {
    // Arrange
    const response = new MockAppointmentResponse();

    mockAppointmentApi({ response });
    mockGetUpcomingAppointmentsApi({
      response: [response],
    });
    mockGetPendingAppointmentsApi({
      response: [response],
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });

    userEvent.click(screen.getByText(/Back to appointments/i));
    expect(screen.baseElement).to.contain.text('Appointments');
  });

  it('should show facility specific timezone when available', async () => {
    // Arrange
    const now = moment().tz('America/Denver');
    const response = new MockAppointmentResponse({ localStartTime: now });
    response.setLocationId('983');

    mockAppointmentApi({ response });
    mockClinicsApi({ clinicId: '455', locationId: '983' });
    mockFacilityFetchByVersion({
      facility: new MockFacilityResponse({ id: 983 }),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/${response.id}`,
    });

    // Assert
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: new RegExp(now.format('dddd, MMMM D, YYYY'), 'i'),
      }),
    ).to.be.ok;

    expect(
      screen.getByText(
        new RegExp(now.tz('America/Denver').format('h:mm'), 'i'),
      ),
    ).to.exist;
    expect(screen.getByText(/Mountain time/i)).to.exist;
  });
});
