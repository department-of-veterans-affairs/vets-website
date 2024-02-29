import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  it('renders', () => {
    render(<Dashboard />);
  });

  it('renders breadcrumbs', () => {
    const { container } = render(<Dashboard />);

    const breadcrumbs = container.querySelector('va-breadcrumbs');
    expect(within(breadcrumbs).getByText('Home')).to.exist;
    expect(within(breadcrumbs).getByText('Dashboard')).to.exist;
  });

  it('renders header', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Accredited Representative Portal')).to.exist;
  });

  it('renders content when has POA permissions', () => {
    const { container } = render(<Dashboard POApermissions />);
    expect(container.querySelector('.placeholder-container')).to.exist;
  });

  it('renders alert header when does not have POA permissions', () => {
    const { getByText } = render(<Dashboard POApermissions={false} />);
    expect(getByText('You are missing some permissions')).to.exist;
  });

  describe('Pending POA requests', () => {
    it('renders table headers', () => {
      const { getByText } = render(<Dashboard />);
      expect(getByText('Claimant')).to.exist;
      expect(getByText('Submitted')).to.exist;
      expect(getByText('Accept/ decline')).to.exist;
    });

    it('renders view all link', () => {
      const { getByTestId } = render(<Dashboard />);
      expect(
        getByTestId('view-all-poa-requests-link').getAttribute('text'),
      ).to.equal('View all');
    });
  });
});
