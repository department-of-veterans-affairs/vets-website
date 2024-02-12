import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  it('renders', () => {
    render(<Dashboard />);
  });

  it('renders breadcrumbs', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Home')).to.exist;
    expect(getByText('Dashboard')).to.exist;
  });

  it('renders header', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Accredited Representative Portal')).to.exist;
  });

  it('renders link to POA requests', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Manage power of attorney requests')).to.exist;
  });
});
