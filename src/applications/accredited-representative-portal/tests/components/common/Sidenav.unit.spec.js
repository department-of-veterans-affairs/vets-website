import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import Sidenav from '../../../components/common/Sidenav';

describe('Sidenav', () => {
  const getSidenav = () =>
    render(
      <MemoryRouter>
        <Sidenav />
      </MemoryRouter>,
    );

  it('renders Sidenav heading', () => {
    const { getByTestId } = getSidenav();
    expect(getByTestId('sidenav-heading')).to.exist;
  });

  it('renders Sidenav', () => {
    const { getByTestId } = getSidenav();
    expect(getByTestId('sidenav-dashboard-item').textContent).to.eq(
      'Dashboard',
    );
    expect(getByTestId('sidenav-poa-requests-item').textContent).to.eq(
      'POA requests',
    );
    expect(getByTestId('sidenav-permissions-item').textContent).to.eq(
      'Permissions',
    );
  });
});
