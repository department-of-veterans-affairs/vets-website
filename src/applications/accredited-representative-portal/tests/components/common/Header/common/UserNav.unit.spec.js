import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

import UserNav from '../../../../../components/common/Header/common/UserNav';
import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../../constants';

describe('UserNav mobile', () => {
  const getUserNavMobile = (isLoading, profile) =>
    render(<UserNav isMobile isLoading={isLoading} profile={profile} />);

  it('renders as Loading', () => {
    const { getByTestId } = getUserNavMobile(true, null);
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const { getByTestId } = getUserNavMobile(false, null);
    const signInLink = getByTestId('user-nav-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first name when has profile', () => {
    const profile = { firstName: 'First', lastName: 'Last' };
    const { getByTestId } = getUserNavMobile(false, profile);

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      profile.firstName,
      expect,
    );
    fireEvent.click(getByTestId('user-nav-dropdown-panel-button'));
    expect(getByTestId('user-nav-sign-out-link').getAttribute('href')).to.eq(
      SIGN_OUT_URL.toString(),
    );
  });
});

describe('UserNav wider than mobile', () => {
  const getUserNavWider = (isLoading, profile) =>
    render(<UserNav isLoading={isLoading} profile={profile} />);

  it('renders as Loading', () => {
    const { getByTestId } = getUserNavWider(true, null);
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const { getByTestId } = getUserNavWider(false, null);
    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first and last name when has profile', () => {
    const profile = { firstName: 'First', lastName: 'Last' };
    const { getByTestId } = getUserNavWider(false, profile);

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      `${profile.firstName} ${profile.lastName}`,
      expect,
    );
    fireEvent.click(getByTestId('user-nav-dropdown-panel-button'));
    expect(getByTestId('user-nav-sign-out-link').getAttribute('href')).to.eq(
      SIGN_OUT_URL.toString(),
    );
  });
});
