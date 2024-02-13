import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import POARequests from '../../containers/POARequests';

describe('POARequests', () => {
  it('renders', () => {
    render(<POARequests />);
  });

  it('renders breadcrumbs', () => {
    const { getByText } = render(<POARequests />);
    expect(getByText('Home')).to.exist;
    expect(getByText('Dashboard')).to.exist;
    expect(getByText('POA requests')).to.exist;
  });

  it('renders header', () => {
    const { getByText } = render(<POARequests />);
    expect(getByText('Power of attorney requests')).to.exist;
  });

  it('renders search input', () => {
    const { getByLabelText } = render(<POARequests />);
    expect(getByLabelText('Search')).to.exist;
  });

  it('renders content when has POA permissions', () => {
    const { container } = render(<POARequests POApermissions />);
    expect(container.querySelector('.placeholder-container')).to.exist;
  });

  it('renders alert header when does not have POA permissions', () => {
    const { getByText } = render(<POARequests POApermissions={false} />);
    expect(getByText('You are missing some permissions')).to.exist;
  });
});
