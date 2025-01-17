import React from 'react';
import { expect } from 'chai';

import { render } from '@testing-library/react';

import CCAppointmentCard from './CCAppointmentCard';

describe('VAOS Component: CCAppointmentCard', () => {
  it('renders with defaults', () => {
    const { getByTestId } = render(<CCAppointmentCard />);
    expect(getByTestId('cc-appointment-card')).to.exist;
    expect(getByTestId('appointment-icon')).to.exist;
    expect(getByTestId('cc-appointment-card-header')).to.exist;
  });

  it('renders children correctly', () => {
    const { getByTestId } = render(
      <CCAppointmentCard>
        <p data-testid="test-child">Test Child</p>
      </CCAppointmentCard>,
    );
    expect(getByTestId('test-child')).to.contain.text('Test Child');
  });
});
