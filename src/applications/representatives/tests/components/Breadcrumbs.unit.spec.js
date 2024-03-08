import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

describe('breadcrumbs', () => {
  it('returns an array of breadcrumbs for the dashboard', () => {
    const { getByText } = render(<Breadcrumbs page="dashboard" />);
    expect(getByText('Home')).to.exist;
    expect(getByText('Dashboard')).to.exist;
  });

  it('returns an array of breadcrumbs for the permissions page', () => {
    const { getByText } = render(<Breadcrumbs page="permissions" />);
    expect(getByText('Home')).to.exist;
    expect(getByText('Permissions')).to.exist;
  });

  it('returns an array of breadcrumbs for the poa-requests page', () => {
    const { getByText } = render(<Breadcrumbs page="poa-requests" />);
    expect(getByText('Home')).to.exist;
    expect(getByText('POA requests')).to.exist;
  });

  it('returns an array of breadcrumbs for the home page', () => {
    const { getByText } = render(<Breadcrumbs page="" />);
    expect(getByText('Home')).to.exist;
  });
});
