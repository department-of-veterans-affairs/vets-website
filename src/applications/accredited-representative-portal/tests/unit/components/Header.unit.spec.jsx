import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Header from '../../../components/Header';
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
const getStore = () =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      accredited_representative_portal_search: true,
    },
  }));

describe('Header', () => {
  it('renders header', () => {
    const { getByTestId } = renderTestComponent(<Header />);
    expect(getByTestId('arp-header')).to.exist;
  });

  it('renders sign in', () => {
    const { getByTestId } = renderTestComponent(<Header />);
    expect(getByTestId('user-nav-sign-in-link')).to.exist;
  });

  it('shows logged in nav items', () => {
    const { getByTestId } = renderTestComponent(<UserNav profile={profile} />);
    expect(getByTestId('desktop-user-nav')).to.exist;
  });

  it('account dropdown exists and toggles account list', () => {
    const { getByTestId } = renderTestComponent(<UserNav profile={profile} />);
    fireEvent.click(getByTestId('account_circle-toggle-dropdown-desktop'));
    expect(getByTestId('account_circle-toggle-dropdown-desktop-list')).to.exist;
    const profileLink = getByTestId('user-nav-profile-link');
    expect(profileLink).to.exist;
    const signOutLink = getByTestId('user-nav-sign-out-link');
    expect(signOutLink).to.exist;
    fireEvent.mouseDown(document);
  });

  it('mobile menu exists and toggles dropdown with poa requests link', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <UserNav profile={profile} />
      </Provider>,
    );
    fireEvent.click(getByTestId('menu-toggle-dropdown-mobile'));
    expect(getByTestId('menu-toggle-dropdown-mobile-list')).to.exist;
    const poaRequestsLink = getByTestId('user-nav-poa-requests-link');
    expect(poaRequestsLink).to.exist;
  });
});
