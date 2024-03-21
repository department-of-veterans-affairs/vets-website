import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DashboardPage from '../../containers/DashboardPage';

describe('Dashboard Page', () => {
  it('renders Dashboard Page', () => {
    render(<DashboardPage />);
  });

  it('renders heading', () => {
    const { getByTestId } = render(<DashboardPage />);
    expect(getByTestId('dashboard-heading').textContent).to.equal(
      'Accredited Representative Portal',
    );
  });

  it('renders content', () => {
    const { getByTestId } = render(<DashboardPage />);
    expect(getByTestId('dashboard-content')).to.exist;
  });
});
