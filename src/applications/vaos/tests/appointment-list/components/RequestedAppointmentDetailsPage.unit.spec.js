import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import { AppointmentList } from '../../../appointment-list';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import MockAppointmentResponse from '../../e2e/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../e2e/fixtures/MockFacilityResponse';
import { mockFacilityFetchByVersion } from '../../mocks/fetch';
import {
  mockAppointmentApi,
  mockAppointmentUpdateApi,
  mockAppointmentsApi,
} from '../../mocks/helpers.v2';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';

describe('VAOS <RequestedAppointmentDetailsPage>', () => {
  const testDate = getTestDate();

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      vaOnlineSchedulingStatusImprovement: true,
      vaOnlineSchedulingVAOSServiceCCAppointments: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
    },
  };

  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should render VA request details with a VAOS appointment', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });
    response
      .setLocationId('983')
      .setReasonCode({
        code: 'New medical issue',
        text: 'A message from the patient',
      })
      .setContact({ phone: '2125551212', email: 'veteranemailtest@va.gov' })
      .setPreferredTimesForPhoneCall({ morning: true });

    mockAppointmentApi({ response });
    mockFacilityFetchByVersion({
      facility: new MockFacilityResponse({ id: '983' }),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
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
      'City 983, WyomingWY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Main phone:');
    expect(screen.getByTestId('facility-telephone')).to.exist;
    expect(screen.baseElement).to.contain.text('Preferred type of appointment');
    expect(screen.baseElement).to.contain.text('Office visit');
    expect(screen.baseElement).to.contain.text('Preferred date and time');

    const start = moment(
      response.getRequestedPeriods()[0].start,
      'YYYY-MM-DDTHH:mm:ss',
    );
    // NOTE: Appointment will alway be in the morning due to setting the date
    // with MockDate.
    expect(screen.baseElement).to.contain.text(
      `${start.format('ddd, MMMM D, YYYY')} in the morning`,
    );

    expect(screen.getByText(/A message from the patient/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('veteranemailtest@va.gov');
    expect(screen.getByTestId('patient-telephone')).to.exist;
    expect(screen.baseElement).to.contain.text('Call morning');
  });

  it('should render CC request details with a VAOS appointment', async () => {
    // Arrange
    const response = MockAppointmentResponse.createCCResponse({
      serviceType: 'audiology',
    });

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
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

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(await screen.findByText(/none/i)).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your contact details',
      }),
    ).to.be.ok;

    expect(screen.queryByText('Community Care')).not.to.exist;
    expect(screen.queryByText('Reason for appointment')).not.to.exist;
  });

  it('should render CC request details using NPI with a VAOS appointment', async () => {
    // Arrange
    const store = createTestStore(initialState);
    const response = MockAppointmentResponse.createCCResponse({
      serviceType: 'audiology',
    });
    response.setPreferredProviderName('AJADI, ADEDIWURA');

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      store,
      path: `/pending/${response.id}`,
    });

    // Assert
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
    expect(screen.getByText('AJADI, ADEDIWURA')).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Preferred date and time',
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.ok;
    expect(await screen.findByText(/none/i)).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your contact details',
      }),
    ).to.be.ok;

    expect(screen.queryByText('Community Care')).not.to.exist;
    expect(screen.queryByText('Reason for appointment')).not.to.exist;
  });

  it('should allow cancellation', async () => {
    // Arrange
    const requestedPeriods = [moment()];
    const appointment = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });
    const canceledResponse = MockAppointmentResponse.createCCResponse({
      serviceType: 'primaryCare',
    });
    canceledResponse
      .setCancelationReason('pat')
      .setRequestedPeriods(requestedPeriods)
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response: appointment });
    mockAppointmentUpdateApi({ response: canceledResponse });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${appointment.id}`,
    });

    // Assert
    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    expect(screen.baseElement).not.to.contain.text('Canceled');

    // When user clicks on cancel request link
    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');

    // And clicks on 'yes, cancel this request' to confirm
    fireEvent.click(screen.getByText(/yes, cancel this request/i));

    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-cancel-request-clicked',
    });

    await waitFor(() => {
      screen.queryByText(/Your appointment has been canceled/i);
    });

    // Then it should display request is canceled
    const modal = await screen.findByTestId('cancel-request-SuccessModal');
    expect(modal.getAttribute('primaryButtonText')).to.eq('Continue');
    const continueBtn = screen.queryByTestId('cancel-request-SuccessModal')
      .__events.primaryButtonClick;
    await continueBtn();

    expect(screen.baseElement).to.contain.text('You canceled this request');
  });

  it('should handle error when canceling', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({
      response,
      responseCode: 500,
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    expect(screen.baseElement).not.to.contain.text('Canceled');

    fireEvent.click(screen.getByText(/cancel request/i));
    await screen.findByRole('alertdialog');

    fireEvent.click(screen.getByText(/yes, cancel this request/i));
    await screen.findByTestId('cancel-request-SuccessModal');

    expect(screen.baseElement).not.to.contain.text('Canceled');
  });

  it('should render CC request with correct requested dates', async () => {
    // Arrange
    const response = MockAppointmentResponse.createCCResponse({
      serviceType: 'audiology',
    });

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
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
        name: 'Preferred community care provider',
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
          response.attributes.requestedPeriods[0].start.replace('Z', ''),
        ).format('ddd, MMMM D, YYYY')} in the morning`,
      ),
    ).to.be.ok;
  });

  it('should go back to requests page when clicking top link', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });
    mockAppointmentsApi({
      end: moment()
        .add(1, 'day')
        .format('YYYY-MM-DD'),
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      response: [response],
    });
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/pending',
    });

    const detailLinks = await screen.findByRole('link', { name: /Details/i });

    fireEvent.click(detailLinks);

    expect(await screen.findByText('Pending primary care appointment')).to.be
      .ok;
    expect(
      screen.getByText('Back to pending appointments').getAttribute('href'),
    ).to.equal('/pending');
  });

  it('should show error message when single fetch errors', async () => {
    // Arrange
    const response = new MockAppointmentResponse();

    mockAppointmentApi({ response, responseCode: 500 });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
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
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });

    mockAppointmentApi({ response });

    // Act
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Pending VA primary care appointment | Veterans Affairs',
      );
    });
  });

  it('should dispay CC document title', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      kind: 'cc',
      serviceType: 'audiology-hearing aid support',
      status: APPOINTMENT_STATUS.proposed,
    });

    mockAppointmentApi({ response });

    // Act
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care hearing aid support appointment | Veterans Affairs`,
      );
    });
  });

  it('should display cancel document title', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.cancelled,
    });
    response.setRequestedPeriods([moment()]);

    mockAppointmentApi({ response });

    // Act
    renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Canceled VA primary care appointment | Veterans Affairs',
      );
    });
  });
});
