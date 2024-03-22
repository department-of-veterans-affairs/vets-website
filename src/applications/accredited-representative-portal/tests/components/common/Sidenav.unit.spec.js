import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Sidenav from '../../../components/common/Sidenav';

describe('Sidenav', () => {
  it('renders sidenav', () => {
    const { getByTestId } = render(<Sidenav />);
    expect(getByTestId('dashboard-sidenav-item').textContent).to.eq(
      'Dashboard',
    );
    // expect(getByTestId('dashboard-sidenav-item')).to.have.attribute(
    //   'href',
    //   '/dashboard',
    // );
    expect(getByTestId('poa-requests-sidenav-item').textContent).to.eq(
      'POA requests',
    );
    // expect(getByTestId('poa-requests-sidenav-item')).to.have.attribute(
    //   'href',
    //   '/poa-requests',
    // );
    expect(getByTestId('permissions-sidenav-item').textContent).to.eq(
      'Permissions',
    );
    // expect(getByTestId('permissions-sidenav-item')).to.have.attribute(
    //   'href',
    //   '/permissions',
    // );
  });
});
