import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import { AppointmentList } from '../../../appointment-list';
import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../../utils/constants';
import MockAppointmentResponse from '../../e2e/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../e2e/fixtures/MockFacilityResponse';
import { mockFacilityFetch } from '../../mocks/fetch';
import {
  mockAppointmentApi,
  mockAppointmentUpdateApi,
  mockAppointmentsApi,
} from '../../mocks/helpers';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../../mocks/setup';

describe('VAOS Page: RequestedAppointmentDetailsPage', () => {
  const testDate = getTestDate();

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      vaOnlineSchedulingVAOSServiceCCAppointments: true,
      vaOnlineSchedulingVAOSServiceRequests: true,
      vaOnlineSchedulingBookingExclusion: false,
    },
  };

  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
  });

  afterEach(() => {
    MockDate.reset();
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
    expect(await screen.findByText('Request for appointment')).to.be.ok;
    expect(
      screen.getByText('Back to request for appointments').getAttribute('href'),
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
        'Request for primary care appointment | Veterans Affairs',
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
        `Request for hearing aid support community care appointment | Veterans Affairs`,
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
        'Canceled request for primary care appointment | Veterans Affairs',
      );
    });
  });

  it('should display cancel warning page', async () => {
    // Arrange
    const store = createTestStore(initialState);
    const requestedPeriods = [moment()];
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });
    const canceledResponse = MockAppointmentResponse.createCCResponse({
      serviceType: 'primaryCare',
    });
    canceledResponse
      .setCancelationReason('pat')
      .setRequestedPeriods(requestedPeriods)
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({ response: canceledResponse });
    mockFacilityFetch({
      facility: new MockFacilityResponse({ id: '983' }),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      store,
      path: `/pending/${response.id}`,
    });

    // Assert
    expect(await screen.findByText('Request for appointment')).to.be.ok;
    expect(screen.baseElement).not.to.contain.text('Canceled');

    // When user clicks on cancel request link
    const button = document.querySelector('va-button[text="Cancel request"]');
    button.click();
    await waitFor(() => {
      expect(store.getState().appointments.showCancelModal).to.equal(true);
    });

    expect(await screen.findByText('Would you like to cancel this request?')).to
      .be.ok;
  });

  it('should display cancel confirmation page', async () => {
    // Arrange
    const store = createTestStore(initialState);
    const requestedPeriods = [moment()];
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    });
    const canceledResponse = MockAppointmentResponse.createCCResponse({
      serviceType: 'primaryCare',
    });
    canceledResponse
      .setCancelationReason('pat')
      .setRequestedPeriods(requestedPeriods)
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({ response: canceledResponse });
    mockFacilityFetch({
      facility: new MockFacilityResponse({ id: '983' }),
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      store,
      path: `/pending/${response.id}`,
    });

    // Assert
    expect(await screen.findByText('Request for appointment')).to.be.ok;
    expect(screen.baseElement).not.to.contain.text('Canceled');

    let button = document.querySelector('va-button[text="Cancel request"]');
    button.click();
    await waitFor(() => {
      expect(store.getState().appointments.showCancelModal).to.equal(true);
    });

    expect(await screen.findByText('Would you like to cancel this request?')).to
      .be.ok;

    button = screen.getByText(/Yes, cancel request/i);
    button.click();

    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-cancel-request-clicked',
    });

    await waitFor(() => {
      screen.queryByText(/You have canceled your appointment/i);
    });
  });

  describe('When on cancel warning page', () => {
    it('should go back to pending appointments detail page when breadcrumb is clicked', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const requestedPeriods = [moment()];
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
      });
      const canceledResponse = MockAppointmentResponse.createCCResponse({
        serviceType: 'primaryCare',
      });
      canceledResponse
        .setCancelationReason('pat')
        .setRequestedPeriods(requestedPeriods)
        .setStatus(APPOINTMENT_STATUS.cancelled);

      mockAppointmentApi({ response });
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
      mockAppointmentUpdateApi({ response: canceledResponse });
      mockFacilityFetch({
        facility: new MockFacilityResponse({ id: '983' }),
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        store,
        path: `/pending/${response.id}`,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Request for appointment',
        }),
      ).to.be.ok;
      expect(screen.baseElement).not.to.contain.text('Canceled');

      const button = document.querySelector('va-button[text="Cancel request"]');
      button.click();
      await waitFor(() => {
        expect(store.getState().appointments.showCancelModal).to.equal(true);
      });

      expect(await screen.findByText('Would you like to cancel this request?'))
        .to.be.ok;

      const link = screen.getByRole('link', {
        name: 'Back to request for appointments',
      });
      fireEvent.click(link);
      await waitFor(
        () =>
          expect(
            screen.queryByRole('heading', {
              level: 1,
              name: /Pending appointments/i,
            }),
          ).to.be.ok,
      );
    });
  });

  describe('When on cancel confirmation page', () => {
    it('should go back to pending appointments list page when breadcrumb is clicked', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const requestedPeriods = [moment()];
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
      });
      const canceledResponse = MockAppointmentResponse.createCCResponse({
        serviceType: 'primaryCare',
      });
      canceledResponse
        .setCancelationReason('pat')
        .setRequestedPeriods(requestedPeriods)
        .setStatus(APPOINTMENT_STATUS.cancelled);

      mockAppointmentApi({ response });

      mockAppointmentsApi({
        start: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        end: moment()
          .add(1, 'day')
          .format('YYYY-MM-DD'),
        statuses: ['proposed', 'cancelled'],
        response: [],
      });
      mockAppointmentUpdateApi({ response: canceledResponse });
      mockFacilityFetch({
        facility: new MockFacilityResponse({ id: '983' }),
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        store,
        path: `/pending/${response.id}`,
      });

      // Assert
      expect(await screen.findByText('Request for appointment')).to.be.ok;
      expect(screen.baseElement).not.to.contain.text('Canceled');

      let button = document.querySelector('va-button[text="Cancel request"]');
      button.click();

      await waitFor(() => {
        expect(store.getState().appointments.showCancelModal).to.equal(true);
      });

      expect(await screen.findByText('Would you like to cancel this request?'))
        .to.be.ok;

      button = screen.getByText(/Yes, cancel request/i);
      button.click();

      expect(window.dataLayer[0]).to.deep.equal({
        event: 'vaos-cancel-request-clicked',
      });

      await waitFor(() => {
        screen.queryByText(/You have canceled your appointment/i);
      });

      const link = screen.getByRole('link', {
        name: 'Back to request for appointments',
      });
      fireEvent.click(link);
      await waitFor(
        () => expect(screen.queryByText(/Pending appointments/i)).to.be.ok,
      );
    });

    it('should display an error', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const requestedPeriods = [moment()];
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
      });
      const canceledResponse = MockAppointmentResponse.createCCResponse({
        serviceType: 'primaryCare',
      });
      canceledResponse
        .setCancelationReason('pat')
        .setRequestedPeriods(requestedPeriods)
        .setStatus(APPOINTMENT_STATUS.cancelled);

      mockAppointmentApi({ response });

      mockAppointmentsApi({
        start: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        end: moment()
          .add(1, 'day')
          .format('YYYY-MM-DD'),
        statuses: ['proposed', 'cancelled'],
        response: [],
      });
      mockAppointmentUpdateApi({
        response: canceledResponse,
        responseCode: 500,
      });
      mockFacilityFetch({
        facility: new MockFacilityResponse({ id: '983' }),
      });

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        store,
        path: `/pending/${response.id}`,
      });

      // Assert
      expect(await screen.findByText('Request for appointment')).to.be.ok;
      expect(screen.baseElement).not.to.contain.text('Canceled');

      let button = document.querySelector('va-button[text="Cancel request"]');
      button.click();

      await waitFor(() => {
        expect(store.getState().appointments.showCancelModal).to.equal(true);
      });

      expect(await screen.findByText('Would you like to cancel this request?'))
        .to.be.ok;

      button = screen.getByText(/Yes, cancel request/i);
      button.click();

      await waitFor(() => {
        expect(store.getState().appointments.cancelAppointmentStatus).to.equal(
          FETCH_STATUS.failed,
        );
      });

      expect(screen.getByText(/We couldn.t cancel your request/i)).to.be.ok;
      expect(
        screen.getByText(
          /Something went wrong when we tried to cancel this request. Please contact your medical center to cancel:/i,
        ),
      ).to.be.ok;
    });
  });
});
