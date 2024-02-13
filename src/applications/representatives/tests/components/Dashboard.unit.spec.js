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

  it('renders content when POApermissions is true', () => {
    const { container } = render(<Dashboard POApermissions />);
    expect(container.querySelector('.placeholder-container')).to.exist;
  });

  it('renders alert header when POApermissions is false', () => {
    const { getByText } = render(<Dashboard POApermissions={false} />);
    expect(getByText('You are missing some permissions')).to.exist;
  });
});
