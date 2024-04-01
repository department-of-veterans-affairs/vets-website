import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  const getDashboard = () => render(<Dashboard />);

  it('renders heading', () => {
    const { getByTestId } = getDashboard();
    expect(getByTestId('dashboard-heading').textContent).to.eq(
      'Accredited Representative Portal',
    );
  });

  it('renders placeholder content', () => {
    const { getByTestId } = getDashboard();
    expect(getByTestId('dashboard-content')).to.exist;
  });

  it('renders POA Requests Widget', () => {
    const { getByTestId } = getDashboard();
    expect(getByTestId('poa-requests-widget-table')).to.exist;
  });
});
