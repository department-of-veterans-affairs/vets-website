import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  it('renders heading', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('dashboard-heading').textContent).to.eq(
      'Accredited Representative Portal',
    );
  });

  it('renders placeholder content', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('dashboard-content')).to.exist;
  });

  it('renders POA Requests Widget', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('poa-requests-widget-table')).to.exist;
  });
});
