import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import LoginHeader from 'platform/user/authentication/components/LoginHeader';

const generateState = ({ toggledOn = false }) => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    profile_hide_direct_deposit_comp_and_pen: toggledOn,
    // eslint-disable-next-line camelcase
    sign_in_modal_v2: toggledOn,
  },
});

describe('LoginHeader', () => {
  it('should render', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/Sign in/)).to.not.be.null;
  });

  it('should render when v2 feature toggle is active', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({ toggledOn: true }),
    });

    expect(screen.queryByText(/Sign in or create an account/)).to.not.be.null;
  });

  it('should display the LogoutAlert component when user is loggedIn', () => {
    const screen = renderInReduxProvider(<LoginHeader loggedOut />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/You have successfully signed out/i)).to.not.be
      .null;
  });
});
