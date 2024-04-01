import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Breadcrumbs from '../../../components/common/Breadcrumbs';

describe('Breadcrumbs', () => {
  const getBreadcrumbs = pathname =>
    render(<Breadcrumbs pathname={pathname} />);

  it('renders Breadcrumbs for the Home page (aka Landing Page)', () => {
    const { getByTestId } = getBreadcrumbs('/representative');
    expect(getByTestId('breadcrumbs-home').textContent).to.eq('Home');
  });

  it('renders Breadcrumbs for the Dashboard Page', () => {
    const { getByTestId } = getBreadcrumbs('/representative/dashboard');
    expect(getByTestId('breadcrumbs-home').textContent).to.eq('Home');
    expect(getByTestId('breadcrumbs-dashboard').textContent).to.eq('Dashboard');
  });

  it('renders Breadcrumbs for the POA Requests Page', () => {
    const { getByTestId } = getBreadcrumbs('/representative/poa-requests');
    expect(getByTestId('breadcrumbs-home').textContent).to.eq('Home');
    expect(getByTestId('breadcrumbs-poa-requests').textContent).to.eq(
      'POA requests',
    );
  });

  it('renders Breadcrumbs for the Permissions Page', () => {
    const { getByTestId } = getBreadcrumbs('/representative/permissions');
    expect(getByTestId('breadcrumbs-home').textContent).to.eq('Home');
    expect(getByTestId('breadcrumbs-permissions').textContent).to.eq(
      'Permissions',
    );
  });

  it('correctly renders breadcrumbs for a deeply nested path', () => {
    const { getByTestId } = getBreadcrumbs(
      '/representative/poa-requests/a-deeply-nested-page',
    );
    expect(getByTestId('breadcrumbs-home').textContent).to.eq('Home');
    expect(getByTestId('breadcrumbs-poa-requests').textContent).to.eq(
      'POA requests',
    );
    expect(getByTestId('breadcrumbs-a-deeply-nested-page').textContent).to.eq(
      'A deeply nested page',
    );
  });
});
