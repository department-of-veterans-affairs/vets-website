import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import UserNav from '../../../../../components/common/Header/UserNav';

const profile = {
  firstName: 'HECTOR',
  lastName: 'ALLEN',
  verified: true,
  signIn: {
    serviceName: 'idme',
  },
  loa: { current: 1 },
};

const rootReducer = combineReducers({
  featureToggles: (state = {}) => state,
  user: (state = {}) => state,
});

const getStore = () =>
  createStore(rootReducer, {
    featureToggles: {
      // eslint-disable-next-line camelcase
      accredited_representative_portal_form_21a: true,
      // eslint-disable-next-line camelcase
      accredited_representative_portal_search: true,
      // eslint-disable-next-line camelcase
      accredited_representative_portal_profile: true,
    },
    user: { profile },
  });

describe('UserNav', () => {
  it('shows logged in nav items', () => {
    const { getByTestId } = render(
      <Provider store={getStore()}>
        <UserNav profile={profile} />
      </Provider>,
    );
    expect(getByTestId('desktop-user-nav')).to.exist;
  });

  it('account dropdown exists and toggles account list', () => {
    const { getByTestId } = render(
      <Provider store={getStore()}>
        <UserNav profile={profile} />
      </Provider>,
    );
    fireEvent.click(getByTestId('account_circle-toggle-dropdown-desktop'));
    expect(getByTestId('account_circle-toggle-dropdown-desktop-list')).to.exist;
    const signOutLink = getByTestId('user-nav-sign-out-link');
    expect(signOutLink).to.exist;
    fireEvent.mouseDown(document);
  });

  it('mobile menu exists and toggles dropdown with poa requests link', () => {
    const { getByTestId } = render(
      <Provider store={getStore()}>
        <UserNav profile={profile} />
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
