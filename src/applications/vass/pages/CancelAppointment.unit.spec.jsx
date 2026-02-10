import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import CancelAppointment from './CancelAppointment';
import { getDefaultRenderOptions, LocationDisplay } from '../utils/test-utils';
import * as authUtils from '../utils/auth';
import {
  createAppointmentData,
  createVassApiStateWithAppointment,
} from '../utils/appointments';
import { URLS } from '../utils/constants';
import {
  createAppointmentDetailsResponse,
  createCancelAppointmentResponse,
} from '../services/mocks/utils/responses';
import { createServiceError } from '../services/mocks/utils/errors';

const appointmentId = 'abcdef123456';
const appointmentData = createAppointmentData({ appointmentId });

const getVassApiState = () =>
  createVassApiStateWithAppointment(appointmentId, appointmentData);

describe('VASS Page: CancelAppointment', () => {
  let getValidVassTokenStub;

  beforeEach(() => {
    getValidVassTokenStub = sinon
      .stub(authUtils, 'getValidVassToken')
      .returns('mock-token');
    mockFetch();
    setFetchJSONResponse(
      global.fetch.onCall(0),
      createAppointmentDetailsResponse({ ...appointmentData }),
    );
  });

  afterEach(() => {
    resetFetch();
    getValidVassTokenStub.restore();
  });

  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(
      <Routes>
        <Route
          path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
          element={<CancelAppointment />}
        />
      </Routes>,
      {
        ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
        initialEntries: [`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`],
      },
    );

    expect(screen.getByTestId('cancel-appointment-page')).to.exist;
    expect(screen.getByTestId('header').textContent).to.contain(
      'Would you like to cancel this appointment?',
    );
    expect(screen.getByTestId('appointment-card')).to.exist;
    expect(screen.getByTestId('cancel-confirm-button-pair')).to.exist;
    expect(screen.queryByTestId('add-to-calendar-link')).not.to.exist;
  });

  describe('navigation', () => {
    beforeEach(() => {
      setFetchJSONResponse(
        global.fetch.onCall(1),
        createCancelAppointmentResponse({ appointmentId }),
      );
    });
    it('should navigate to cancel confirmation page when "Yes, cancel appointment" is clicked', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<CancelAppointment />}
            />
            <Route
              path={`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`}
              element={<div>Cancel Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.primaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${appointmentId}`,
        );
      });
    });

    it('should navigate to confirmation page with details when "No, don\'t cancel" is clicked', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<CancelAppointment />}
            />
            <Route
              path={`${URLS.CONFIRMATION}/:appointmentId`}
              element={<div>Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.secondaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.CONFIRMATION}/${appointmentId}?details=true`,
        );
      });
    });
  });

  describe('API error handling', () => {
    it('should display error alert when cancel appointment fails with server error', async () => {
      setFetchJSONFailure(global.fetch.onCall(1), createServiceError());

      const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<CancelAppointment />}
            />
          </Routes>
        </>,
        {
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`],
        },
      );

      await waitFor(() => {
        expect(getByTestId('cancel-confirm-button-pair')).to.exist;
      });

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.primaryClick();

      await waitFor(() => {
        expect(getByTestId('api-error-alert')).to.exist;
        expect(queryByTestId('back-link')).to.not.exist;
        expect(queryByTestId('header')).to.not.exist;
      });
    });

    it('should not navigate when cancel appointment returns an error', async () => {
      setFetchJSONFailure(global.fetch.onCall(1), createServiceError());

      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<CancelAppointment />}
            />
            <Route
              path={`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`}
              element={<div>Cancel Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`],
        },
      );

      await waitFor(() => {
        expect(getByTestId('cancel-confirm-button-pair')).to.exist;
      });

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.primaryClick();

      await waitFor(() => {
        // Should still be on cancel appointment page
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.CANCEL_APPOINTMENT}/${appointmentId}`,
        );
      });
    });
  });
});
