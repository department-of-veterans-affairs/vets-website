import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import UserNav from '../../../components/Header/UserNav';
import { renderTestComponent } from '../helpers';

const profile = {
  firstName: 'HECTOR',
  lastName: 'ALLEN',
  verified: true,
  signIn: {
    serviceName: 'idme',
  },
};
describe('Header', () => {
  it('shows logged in nav items', () => {
    const { getByTestId } = renderTestComponent(<UserNav profile={profile} />);
    expect(getByTestId('desktop-user-nav')).to.exist;
  });

  it('account dropdown exists and toggles account list', () => {
    const { getByTestId } = renderTestComponent(<UserNav profile={profile} />);
    fireEvent.click(getByTestId('account_circle-toggle-dropdown-desktop'));
    expect(getByTestId('account_circle-toggle-dropdown-desktop-list')).to.exist;
    fireEvent.mouseDown(document);
  });

  it('mobile menu exists and toggles dropdown with poa requests link', () => {
    const { getByTestId } = renderTestComponent(<UserNav profile={profile} />);
    fireEvent.click(getByTestId('menu-toggle-dropdown-mobile'));
    expect(getByTestId('menu-toggle-dropdown-mobile-list')).to.exist;
    const poaRequestsLink = getByTestId('user-nav-poa-requests-link');
    expect(poaRequestsLink).to.exist;
  });
});
