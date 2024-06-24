import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import UserNav from '../../../../../components/common/Header/common/UserNav';
import { SIGN_IN_URL, SIGN_OUT_URL } from '../../../../../constants';

const mockStore = configureStore([]);

const getUserNav = (isMobile, isLoading, profile) => {
  const store = mockStore({
    user: { isLoading, profile },
  });

  return render(
    <Provider store={store}>
      <UserNav isMobile={isMobile} />
    </Provider>,
  );
};

describe('UserNav mobile', () => {
  it('renders as Loading', () => {
    const { getByTestId } = getUserNav(true, true, null);
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const { getByTestId } = getUserNav(true, false, null);
    const signInLink = getByTestId('user-nav-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first name when has profile', () => {
    const profile = { firstName: 'First', lastName: 'Last' };
    const { getByTestId } = getUserNav(true, false, profile);

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
  it('renders as Loading', () => {
    const { getByTestId } = getUserNav(false, true, null);
    expect(getByTestId('user-nav-loading-icon')).to.exist;
  });

  it('renders as Sign in link when no profile exists', () => {
    const { getByTestId } = getUserNav(false, false, null);
    const signInLink = getByTestId('user-nav-wider-than-mobile-sign-in-link');

    expect(signInLink.textContent).to.eq('Sign in');
    expect(signInLink.getAttribute('href')).to.eq(SIGN_IN_URL.toString());
  });

  it('renders with first and last name when has profile', () => {
    const profile = { firstName: 'First', lastName: 'Last' };
    const { getByTestId } = getUserNav(false, false, profile);

    expect(getByTestId('user-nav-user-name').textContent).to.eq(
      `${profile.firstName} ${profile.lastName}`,
    );
    fireEvent.click(getByTestId('user-nav-dropdown-panel-button'));
    expect(getByTestId('user-nav-sign-out-link').getAttribute('href')).to.eq(
      SIGN_OUT_URL.toString(),
    );
  });
});
