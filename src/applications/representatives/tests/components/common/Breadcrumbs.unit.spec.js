import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import Breadcrumbs from '../../../components/common/Breadcrumbs';

describe('breadcrumbs', () => {
  it('creates breadcrumbs for the dashboard', () => {
    const { getByText } = render(
      <Breadcrumbs pathname="/representatives/dashboard" />,
    );
    expect(getByText('Home')).to.exist;
    expect(getByText('Dashboard')).to.exist;
  });

  it('creates breadcrumbs for the permissions page', () => {
    const { getByText } = render(
      <Breadcrumbs pathname="/representatives/permissions" />,
    );
    expect(getByText('Home')).to.exist;
    expect(getByText('Permissions')).to.exist;
  });

  it('creates breadcrumbs for the POA Requests page', () => {
    const { getByText } = render(
      <Breadcrumbs pathname="/representatives/poa-requests" />,
    );
    expect(getByText('Home')).to.exist;
    expect(getByText('POA requests')).to.exist;
  });

  it('creates breadcrumbs for the home page by default', () => {
    const { getByText } = render(<Breadcrumbs pathname="representatives" />);
    expect(getByText('Home')).to.exist;
  });
});
