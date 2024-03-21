import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Breadcrumbs from '../../../components/common/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders breadcrumbs for the Home page (aka Landing Page)', () => {
    const { getByTestId } = render(<Breadcrumbs pathname="/representative" />);
    expect(getByTestId('home-breadcrumb').textContent).to.equal('Home');
    expect(getByTestId('home-breadcrumb')).to.have.attribute(
      'href',
      '/representative',
    );
  });

  it('renders breadcrumbs for the Dashboard Page', () => {
    const { getByTestId } = render(
      <Breadcrumbs pathname="/representative/dashboard" />,
    );

    expect(getByTestId('home-breadcrumb').textContent).to.equal('Home');
    expect(getByTestId('home-breadcrumb')).to.have.attribute(
      'href',
      '/representative',
    );
    expect(getByTestId('dashboard-breadcrumb').textContent).to.equal(
      'Dashboard',
    );
  });

  it('renders breadcrumbs for the POA Requests Page', () => {
    const { getByTestId } = render(
      <Breadcrumbs pathname="/representative/poa-requests" />,
    );
    expect(getByTestId('home-breadcrumb').textContent).to.equal('Home');
    expect(getByTestId('home-breadcrumb')).to.have.attribute(
      'href',
      '/representative',
    );
    expect(getByTestId('poa-requests-breadcrumb').textContent).to.equal(
      'POA requests',
    );
  });

  it('renders breadcrumbs for the Permissions page', () => {
    const { getByTestId } = render(
      <Breadcrumbs pathname="/representative/permissions" />,
    );
    expect(getByTestId('home-breadcrumb').textContent).to.equal('Home');
    expect(getByTestId('home-breadcrumb')).to.have.attribute(
      'href',
      '/representative',
    );
    expect(getByTestId('permissions-breadcrumb').textContent).to.equal(
      'Permissions',
    );
  });
});
