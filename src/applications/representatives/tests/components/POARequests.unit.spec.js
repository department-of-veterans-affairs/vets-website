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
    expect(getByText('POA Requests')).to.exist;
  });

  it('renders header', () => {
    const { getByText } = render(<POARequests />);
    expect(getByText('Power of Attorney Requests')).to.exist;
  });

  it('renders search input', () => {
    const { getByLabelText } = render(<POARequests />);
    expect(getByLabelText('Search')).to.exist;
  });
});
