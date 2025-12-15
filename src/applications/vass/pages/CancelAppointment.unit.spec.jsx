import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelAppointment from './CancelAppointment';

describe('VASS Page: CancelAppointment', () => {
  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(<CancelAppointment />, {
      initialState: {},
    });

    expect(screen.getByTestId('cancel-appointment-page')).to.exist;
    expect(screen.getByTestId('header').textContent).to.contain(
      'Would you like to cancel this appointment?',
    );
    expect(screen.getByTestId('appointment-card')).to.exist;
    expect(screen.getByTestId('cancel-confirm-button-pair')).to.exist;
  });
});
