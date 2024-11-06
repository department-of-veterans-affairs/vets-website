import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import { AppointmentList } from './index';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingBreadcrumbUrlUpdate: true,
  },
};

describe('VAOS Page: AppointmentsPage index', () => {
  it('should display 404 page for unknown paths', async () => {
    // Given the veteran lands on the VAOS homepage
    // When the page displays
    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState,
      path: '/unknown/path',
    });

    expect(screen.getByText(/Sorry — we can’t find that page/)).to.be.ok;
  });
});
