import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import LoginHeader from 'platform/user/authentication/components/LoginHeader';

describe('LoginHeader', () => {
  it('should render', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: {},
    });

    expect(screen.queryByText(/Sign in or create an account/)).to.not.be.null;
  });

  it('should display the SessionTimeoutAlert component when the session is expired', () => {
    const originalLocation = global.window.location;

    global.window.location = {
      ...originalLocation,
      search: '?status=session_expired',
    };
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: {},
    });
    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.not.be.null;

    global.window.location = originalLocation;
  });
});
