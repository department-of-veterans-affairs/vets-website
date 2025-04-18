import { expect } from 'chai';
import React from 'react';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

import CCAppointmentCard from './CCAppointmentCard';

describe('VAOS Component: CCAppointmentCard', () => {
  it('renders with defaults', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CCAppointmentCard />,
      createTestStore({}),
    );
    expect(getByTestId('cc-appointment-card')).to.exist;
    expect(getByTestId('appointment-icon')).to.exist;
    expect(getByTestId('cc-appointment-card-header')).to.exist;
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CCAppointmentCard>
        <p data-testid="test-child">Test Child</p>
      </CCAppointmentCard>,
      createTestStore({}),
    );
    expect(getByTestId('test-child')).to.contain.text('Test Child');
  });
});
