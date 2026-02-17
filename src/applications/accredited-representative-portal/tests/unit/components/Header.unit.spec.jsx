import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Header from '~/platform/site-wide/representative/components/header/Header';
import { renderTestComponent, renderTestApp } from '../helpers';

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
      // eslint-disable-next-line camelcase
      accredited_representative_portal_profile: true,
    },
  }));
describe('Header', () => {
  it('renders header', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Header />
      </Provider>,
    );
    expect(getByTestId('arp-header')).to.exist;
  });

  it('renders sign in', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Header />
      </Provider>,
    );
    expect(getByTestId('user-nav-sign-in-link')).to.exist;
  });

  it('shows logged in nav items', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Header profile={profile} />
      </Provider>,
    );

    expect(getByTestId('desktop-user-nav')).to.exist;
  });

  it('account dropdown exists and toggles account list', () => {
    const { getByTestId } = renderTestComponent(
      <Provider store={getStore()}>
        <Header profile={profile} />
      </Provider>,
    );
    fireEvent.click(getByTestId('account_circle-toggle-dropdown-desktop'));
    expect(getByTestId('account_circle-toggle-dropdown-desktop-list')).to.exist;
    const signOutLink = getByTestId('user-nav-sign-out-link');
    expect(signOutLink).to.exist;
    fireEvent.mouseDown(document);
  });

  it('mobile menu exists and toggles dropdown with poa requests link', () => {
    const { getByTestId } = renderTestApp(
      <Provider store={getStore()}>
        <Header profile={profile} />
      </Provider>,
    );
    fireEvent.click(getByTestId('menu-toggle-dropdown-mobile'));
    expect(getByTestId('menu-toggle-dropdown-mobile-list')).to.exist;
    const poaRequestsLink = getByTestId(
      'user-nav-representation-requests-link',
    );
    expect(poaRequestsLink).to.exist;
  });
});
