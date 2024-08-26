import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import createReduxStore from '../../../../../store';

import UserNav from '../../../../../components/common/Header/common/UserNav';
import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../../constants';
import { TestAppContainer } from '../../../../helpers';
import {
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_USER,
} from '../../../../../actions/user';

function renderTestApp({ isMobile, initAction } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <TestAppContainer store={store}>
      <UserNav isMobile={isMobile} />
    </TestAppContainer>,
  );
}

describe('UserNav mobile', () => {
  const isMobile = true;

  it('renders as Loading', () => {
    const initAction = {
      type: FETCH_USER,
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const initAction = {
      type: FETCH_USER_FAILURE,
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });
    const signInLink = getByTestId('user-nav-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first name when has profile', () => {
    const profile = {
      firstName: 'First',
      lastName: 'Last',
    };

    const initAction = {
      type: FETCH_USER_SUCCESS,
      payload: {
        account: {},
        profile,
      },
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      profile.firstName,
    );
    fireEvent.click(getByTestId('user-nav-dropdown-panel-button'));
    expect(getByTestId('user-nav-sign-out-link').getAttribute('href')).to.eq(
      SIGN_OUT_URL.toString(),
    );
  });
});

describe('UserNav wider than mobile', () => {
  const isMobile = false;

  it('renders as Loading', () => {
    const initAction = {
      type: FETCH_USER,
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const initAction = {
      type: FETCH_USER_FAILURE,
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });
    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first and last name when has profile', () => {
    const profile = {
      firstName: 'First',
      lastName: 'Last',
    };

    const initAction = {
      type: FETCH_USER_SUCCESS,
      payload: {
        account: {},
        profile,
      },
    };

    const { getByTestId } = renderTestApp({ isMobile, initAction });

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      `${profile.firstName} ${profile.lastName}`,
    );
    fireEvent.click(getByTestId('user-nav-dropdown-panel-button'));
    expect(getByTestId('user-nav-sign-out-link').getAttribute('href')).to.eq(
      SIGN_OUT_URL.toString(),
    );
  });
});
