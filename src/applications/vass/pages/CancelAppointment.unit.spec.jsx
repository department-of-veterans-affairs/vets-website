import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelAppointment from './CancelAppointment';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

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

const defaultRenderOptions = {
  initialState: {
    vassForm: {
      hydrated: false,
      selectedDate: null,
      selectedTopics: [],
    },
  },
  reducers,
  additionalMiddlewares: [vassApi.middleware],
};

describe('VASS Page: CancelAppointment', () => {
  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(
      <CancelAppointment />,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('cancel-appointment-page')).to.exist;
    expect(screen.getByTestId('header').textContent).to.contain(
      'Would you like to cancel this appointment?',
    );
    expect(screen.getByTestId('appointment-card')).to.exist;
    expect(screen.getByTestId('cancel-confirm-button-pair')).to.exist;
  });

  describe('navigation', () => {
    it('should navigate to cancel confirmation page when "Yes, cancel appointment" is clicked', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <>
          <Routes>
            <Route
              path="/cancel-appointment/:id"
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
          initialEntries: ['/cancel-appointment/abcdef123456'],
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
              path="/cancel-appointment/:id"
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
          initialEntries: ['/cancel-appointment/abcdef123456'],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.secondaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/confirmation/abcdef123456?details=true',
        );
      });
    });
  });
});
