import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  it('renders', () => {
    render(<Dashboard />);
  });

  it('renders header', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Accredited Representative Portal')).to.exist;
  });

  it('renders content when has POA permissions', () => {
    const { container } = render(<Dashboard />);
    expect(container.querySelector('.placeholder-container')).to.exist;
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
      expect(getByTestId('view-all-poa-requests-link')).to.contain.text(
        'View all',
      );
    });
  });
});
