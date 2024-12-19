import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import LoginHeader from 'platform/user/authentication/components/LoginHeader';

const generateState = ({ toggledOn = false }) => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    profile_hide_direct_deposit_comp_and_pen: toggledOn,
  },
});

describe('LoginHeader', () => {
  it('should render', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/Sign in or create an account/)).to.not.be.null;
  });

  it('should display the LogoutAlert component when user is logged out', () => {
    const screen = renderInReduxProvider(<LoginHeader loggedOut />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/You have successfully signed out/i)).to.not.be
      .null;
  });

  it('should display the SessionTimeoutAlert component when the session is expired', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      search: '?status=session_expired',
    };
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({}),
    });
    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.not.be.null;
    window.location = originalLocation;
  });
});
