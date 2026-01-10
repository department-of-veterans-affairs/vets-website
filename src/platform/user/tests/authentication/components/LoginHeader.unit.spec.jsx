import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { mockLocation } from 'platform/testing/unit/helpers';
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

  it('should display the SessionTimeoutAlert component when the session is expired', () => {
    // Use mockLocation for JSDOM 22+ compatibility
    const restoreLocation = mockLocation('http://localhost/?status=session_expired');
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({}),
    });
    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.not.be.null;
    restoreLocation();
  });
});
