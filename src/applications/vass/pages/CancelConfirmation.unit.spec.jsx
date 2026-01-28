import React from 'react';
import { expect } from 'chai';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelConfirmation from './CancelConfirmation';
import {
  getDefaultRenderOptions,
  createMockAppointmentData,
  createVassApiStateWithAppointment,
} from '../utils/test-utils';

const appointmentId = 'abcdef123456';
const appointmentData = createMockAppointmentData({ appointmentId });

const getVassApiState = () =>
  createVassApiStateWithAppointment(appointmentId, appointmentData);

describe('VASS Component: CancelConfirmation', () => {
  it('renders page, message, and appointment card', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <Routes>
        <Route
          path="/cancel-appointment/confirmation/:appointmentId"
          element={<CancelConfirmation />}
        />
      </Routes>,
      {
        ...getDefaultRenderOptions({}, { vassApi: getVassApiState() }),
        initialEntries: [`/cancel-appointment/confirmation/${appointmentId}`],
      },
    );
    expect(getByTestId('cancel-confirmation-page')).to.exist;
    expect(getByTestId('cancel-confirmation-message').textContent).to.match(
      /If you need to reschedule, call us at.*/i,
    );
    expect(getByTestId('cancel-confirmation-phone')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
  });
});
