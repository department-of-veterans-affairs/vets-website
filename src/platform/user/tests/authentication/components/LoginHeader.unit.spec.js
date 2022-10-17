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

    expect(screen.queryByText(/Sign in/i)).to.not.be.null;
  });

  it('should display the LogoutAlert component when user is loggedIn', () => {
    const screen = renderInReduxProvider(<LoginHeader loggedOut />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/You have successfully signed out/i)).to.not.be
      .null;
  });

  it('should display direct deposit error', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({ toggledOn: true }),
    });

    const directDepositDesc = /We’re sorry. Disability and pension direct deposit information isn’t available right now. We’re doing some maintenance work on this system./i;

    expect(screen.queryByText(directDepositDesc)).to.not.be.null;
  });
});
