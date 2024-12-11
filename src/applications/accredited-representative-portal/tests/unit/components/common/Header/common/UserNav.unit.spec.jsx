import React from 'react';
import { expect } from 'chai';
import UserNav from '../../../../../../components/common/Header/UserNav';
import { SIGN_IN_URL } from '../../../../../../constants';
import { renderTestApp } from '../../../../helpers';
import {
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_USER,
} from '../../../../../../actions/user';

describe('UserNav mobile', () => {
  it('renders as Loading', () => {
    const isLoading = true;
    const initAction = {
      type: FETCH_USER,
    };

    const { getByTestId } = renderTestApp(<UserNav isLoading={isLoading} />, {
      initAction,
    });

    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const initAction = {
      type: FETCH_USER_FAILURE,
    };

    const { getByTestId } = renderTestApp(<UserNav />, {
      initAction,
    });

    const signInLink = getByTestId('user-nav-sign-in-link');

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

    const { getByTestId } = renderTestApp(<UserNav profile={profile} />, {
      initAction,
    });

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      `${profile.firstName} ${profile.lastName}`,
    );
  });
});

describe('UserNav wider than mobile', () => {
  const isLoading = true;

  it('renders as Loading', () => {
    const initAction = {
      type: FETCH_USER,
    };

    const { getByTestId } = renderTestApp(<UserNav isLoading={isLoading} />, {
      initAction,
    });

    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const initAction = {
      type: FETCH_USER_FAILURE,
    };

    const { getByTestId } = renderTestApp(<UserNav />, {
      initAction,
    });

    const signInLink = getByTestId('user-nav-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });
});
