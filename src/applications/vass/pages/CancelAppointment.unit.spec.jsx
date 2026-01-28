import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelAppointment from './CancelAppointment';
import {
  getDefaultRenderOptions,
  createMockAppointmentData,
  createVassApiStateWithAppointment,
  LocationDisplay,
} from '../utils/test-utils';
import * as vassApi from '../redux/api/vassApi';

const appointmentId = 'abcdef123456';
const appointmentData = createMockAppointmentData({ appointmentId });

const getVassApiState = () =>
  createVassApiStateWithAppointment(appointmentId, appointmentData);

describe('VASS Page: CancelAppointment', () => {
  let cancelAppointmentStub;

  beforeEach(() => {
    // Mock the cancelAppointment mutation to resolve immediately
    const mockCancelAppointment = sinon.stub().returns({
      unwrap: () => Promise.resolve({ data: {} }),
    });
    cancelAppointmentStub = sinon
      .stub(vassApi, 'useCancelAppointmentMutation')
      .returns([mockCancelAppointment, { isLoading: false }]);
  });

  afterEach(() => {
    cancelAppointmentStub.restore();
  });

  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(
      <Routes>
        <Route
          path="/cancel-appointment/:appointmentId"
          element={<CancelAppointment />}
        />
      </Routes>,
      {
        ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
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
              path="/cancel-appointment/confirmation/:appointmentId"
              element={<div>Cancel Confirmation Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
          initialEntries: [`/cancel-appointment/${appointmentId}`],
        },
      );

      const buttonPair = getByTestId('cancel-confirm-button-pair');
      buttonPair.__events.primaryClick();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `/cancel-appointment/confirmation/${appointmentId}`,
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
          ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
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
