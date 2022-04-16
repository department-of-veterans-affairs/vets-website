import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import DhpApp from '../../containers/App';

describe('connect health devices landing page, user not logged in', () => {
  it('App renders', () => {
    const dhpContainer = renderInReduxProvider(<DhpApp />);
    const title = 'Connect your health devices to share data';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it("App renders 'Sign in or create account' button", () => {
    const loggedInState = {
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    };
    const screen = renderInReduxProvider(<DhpApp />, {
      initialState: loggedInState,
    });
    expect(screen.getByText(/Sign in or create an account/)).to.exist;
  });
});
