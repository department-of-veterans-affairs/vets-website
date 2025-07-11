import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AlertCard from '../../components/AlertCard';

describe('<AlertCard>', () => {
  it('renders without crashing', () => {
    const { container } = render(<AlertCard debtType="DEBT" />);
    // Check that the component renders with the expected alert
    expect(container.querySelector('va-alert')).to.exist;
    expect(container.querySelector('[data-testid="balance-card-alert-debt"]'))
      .to.exist;
  });
});
