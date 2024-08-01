import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import Breadcrumbs from '../../../components/common/Breadcrumbs';

describe('Breadcrumbs', () => {
  const getBreadcrumbs = pathname =>
    render(
      <MemoryRouter initialEntries={[pathname]}>
        <Breadcrumbs />
      </MemoryRouter>,
    );

  it('renders Breadcrumbs for the Home page (aka Landing Page)', () => {
    const { getByTestId } = getBreadcrumbs('/');
    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the Dashboard Page', () => {
    const { getByTestId } = getBreadcrumbs('/dashboard');
    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the POA Requests Page', () => {
    const { getByTestId } = getBreadcrumbs('/poa-requests');
    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the Permissions Page', () => {
    const { getByTestId } = getBreadcrumbs('/permissions');
    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('correctly renders breadcrumbs for a deeply nested path', () => {
    const { getByTestId } = getBreadcrumbs(
      '/poa-requests/a-deeply-nested-page',
    );
    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });
});
