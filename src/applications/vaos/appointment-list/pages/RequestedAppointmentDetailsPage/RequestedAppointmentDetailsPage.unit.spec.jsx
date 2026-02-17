import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { expect } from 'chai';
import { addDays, subDays } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import { AppointmentList } from '../..';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import {
  mockAppointmentApi,
  mockAppointmentsApi,
  mockAppointmentUpdateApi,
  mockFacilityApi,
} from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../../utils/constants';

describe('VAOS Page: RequestedAppointmentDetailsPage', () => {
  const testDate = getTestDate();

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingBookingExclusion: false,
    },
  };

  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
    mockFacilityApi({ id: '983' });
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should go back to requests page when clicking top link', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    });
    mockAppointmentsApi({
      end: addDays(new Date(), 2),
      start: subDays(new Date(), 120),
      statuses: ['proposed', 'cancelled'],
      response: [response],
    });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/pending',
    });

    // Assert
    const detailLinks = await screen.findByRole('link', { name: /Details/i });

    fireEvent.click(detailLinks);
    expect(await screen.findByText('Request for appointment')).to.be.ok;
    const link = screen.container.querySelector(
      'va-link[text="Back to pending appointments"]',
    );
    userEvent.click(link);
    expect(screen.history.push.called).to.be.true;
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal('/pending');
    });
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
    // CI-FIX: Wait for the error heading to be present first, then verify focus.
    // On CI (especially with Node 22), async state updates resolve faster than
    // locally. Waiting for the heading to exist before checking focus ensures
    // consistent behavior regardless of timing. Test behavior unchanged: still
    // verifies that error heading is displayed and receives focus.
    const errorHeading = await screen.findByRole('heading', {
      level: 1,
      name: /We can.t access your appointment details right now/,
    });
    expect(errorHeading).to.be.ok;
    await waitFor(() => {
      expect(document.activeElement).to.have.tagName('h1');
    });
  });

  it('should display pending document title', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setType('REQUEST');

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    // CI-FIX: Wait for the h1 heading to be present first, indicating the page has loaded.
    // Only then check document.title. On CI, the title may not be set until the
    // component fully renders. Test behavior unchanged: still verifies the correct
    // document title is set.
    await screen.findByRole('heading', { level: 1 });
    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Pending Request For Appointment | Veterans Affairs',
      );
    });
  });

  it('should display CC document title', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
    })
      .setKind('cc')
      .setType('COMMUNITY_CARE_REQUEST')
      .setPending(true);

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    // CI-FIX: Wait for the h1 heading to be present first, indicating the page has loaded.
    // Only then check document.title. On CI, the title may not be set until the
    // component fully renders. Test behavior unchanged: still verifies the correct
    // document title is set.
    await screen.findByRole('heading', { level: 1 });
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Request For Community Care Appointment | Veterans Affairs`,
      );
    });
  });

  it('should display cancel document title', async () => {
    // Arrange
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.cancelled,
      pending: true,
    }).setType('REQUEST');
    response.setRequestedPeriods([new Date()]);

    mockAppointmentApi({ response });

    // Act
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: `/pending/${response.id}`,
    });

    // Assert
    // CI-FIX: Wait for the h1 heading to be present first, indicating the page has loaded.
    // Only then check document.title. On CI, the title may not be set until the
    // component fully renders. Test behavior unchanged: still verifies the correct
    // document title is set.
    await screen.findByRole('heading', { level: 1 });
    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Canceled Request For Appointment | Veterans Affairs',
      );
    });
  });

  it('should display cancel warning page', async () => {
    // Arrange
    const store = createTestStore(initialState);
    const requestedPeriods = [new Date()];
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setType('REQUEST');
    const canceledResponse = MockAppointmentResponse.createCCResponse();
    canceledResponse
      .setType('REQUEST')
      .setCancelationReason('pat')
      .setRequestedPeriods(requestedPeriods)
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({ response: canceledResponse });

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
    const requestedPeriods = [new Date()];
    const response = new MockAppointmentResponse({
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setType('REQUEST');
    const canceledResponse = MockAppointmentResponse.createCCResponse();
    canceledResponse
      .setType('REQUEST')
      .setCancelationReason('pat')
      .setRequestedPeriods(requestedPeriods)
      .setStatus(APPOINTMENT_STATUS.cancelled);

    mockAppointmentApi({ response });
    mockAppointmentUpdateApi({ response: canceledResponse });

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

    expect(window.dataLayer).to.deep.include({
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
      const requestedPeriods = [new Date()];
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
        pending: true,
      }).setType('REQUEST');
      const canceledResponse = MockAppointmentResponse.createCCResponse();
      canceledResponse
        .setType('REQUEST')
        .setCancelationReason('pat')
        .setRequestedPeriods(requestedPeriods)
        .setStatus(APPOINTMENT_STATUS.cancelled);

      mockAppointmentApi({ response });
      mockAppointmentsApi({
        end: addDays(new Date(), 2),
        start: subDays(new Date(), 120),
        statuses: ['proposed', 'cancelled'],
        response: [response],
      });
      mockAppointmentUpdateApi({ response: canceledResponse });

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

      const link = screen.container.querySelector(
        'va-link[text="Back to pending appointments"]',
      );
      fireEvent.click(link);
      expect(screen.history.push.called).to.be.true;
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal('/pending');
        expect(
          screen.queryByRole('heading', {
            level: 1,
            name: /Pending appointments/i,
          }),
        ).to.be.ok;
      });
    });
  });

  describe('When on cancel confirmation page', () => {
    it('should go back to pending appointments list page when breadcrumb is clicked', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const requestedPeriods = [new Date()];
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
        pending: true,
      }).setType('COMMUNITY_CARE_REQUEST');
      const canceledResponse = MockAppointmentResponse.createCCResponse();
      canceledResponse
        .setCancelationReason('pat')
        .setRequestedPeriods(requestedPeriods)
        .setStatus(APPOINTMENT_STATUS.cancelled)
        .setPending(true)
        .setType('COMMUNITY_CARE_REQUEST');

      mockAppointmentApi({ response });

      mockAppointmentsApi({
        start: subDays(new Date(), 120),
        end: addDays(new Date(), 2),
        statuses: ['proposed', 'cancelled'],
        response: [],
      });
      mockAppointmentUpdateApi({ response: canceledResponse });

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

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-cancel-request-clicked',
      });

      await waitFor(() => {
        screen.queryByText(/You have canceled your appointment/i);
      });

      await waitFor(() => {
        const link = screen.container.querySelector(
          'va-link[text="Back to pending appointments"]',
        );

        expect(link).to.be.ok;
        fireEvent.click(link);
      });
      await waitFor(
        () => expect(screen.queryByText(/Pending appointments/i)).to.be.ok,
      );
    });

    it('should display an error', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
        pending: true,
      }).setType('REQUEST');

      mockAppointmentApi({ response });

      mockAppointmentsApi({
        start: subDays(new Date(), 120),
        end: addDays(new Date(), 1),
        statuses: ['proposed', 'cancelled'],
        response: [],
      });
      mockAppointmentUpdateApi({
        id: '1',
        responseCode: 500,
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
