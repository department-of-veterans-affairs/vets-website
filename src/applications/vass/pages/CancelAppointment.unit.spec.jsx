import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelAppointment from './CancelAppointment';
import { getDefaultRenderOptions } from '../utils/test-utils';
import { createAppointmentData } from '../utils/appointments';

// Helper component to display current location for testing navigation
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
    </div>
  );
};

const appointmentId = 'abcdef123456';
const appointmentData = createAppointmentData({ appointmentId });

// Pre-populate the RTK Query cache with the appointment data
const vassApiState = {
  queries: {
    [`getAppointment({"appointmentId":"${appointmentId}"})`]: {
      status: 'fulfilled',
      endpointName: 'getAppointment',
      requestId: 'test',
      startedTimeStamp: 0,
      data: appointmentData,
    },
  },
  mutations: {},
  provided: {},
  subscriptions: {},
  config: {
    online: true,
    focused: true,
    middlewareRegistered: true,
  },
};

const defaultRenderOptions = getDefaultRenderOptions(
  {},
  { vassApi: vassApiState },
);

describe('VASS Page: CancelAppointment', () => {
  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(
      <Routes>
        <Route
          path="/cancel-appointment/:appointmentId"
          element={<CancelAppointment />}
        />
      </Routes>,
      {
        ...defaultRenderOptions,
        initialEntries: [`/cancel-appointment/${appointmentId}`],
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
    it('should navigate to cancel confirmation page when "Yes, cancel appointment" is clicked', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path="/cancel-appointment/:appointmentId"
              element={<CancelAppointment />}
            />
            <Route
              path="/cancel-appointment/confirmation"
              element={<div>Cancel Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [`/cancel-appointment/${appointmentId}`],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.primaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/cancel-appointment/confirmation',
        );
      });
    });

    it('should navigate to confirmation page with details when "No, don\'t cancel" is clicked', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path="/cancel-appointment/:appointmentId"
              element={<CancelAppointment />}
            />
            <Route
              path="/confirmation/:appointmentId"
              element={<div>Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [`/cancel-appointment/${appointmentId}`],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.secondaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `/confirmation/${appointmentId}?details=true`,
        );
      });
    });
  });
});
