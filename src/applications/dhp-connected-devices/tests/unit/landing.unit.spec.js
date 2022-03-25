import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import DhpApp from '../../containers/App';

describe('connect health devices landing page', () => {
  it('App renders', () => {
    const dhpContainer = renderInReduxProvider(<DhpApp />);
    const title = 'Connect your health devices';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it('renders with FAQ section', () => {
    const screen = renderInReduxProvider(<DhpApp />);
    expect(screen.getByText(/Frequently asked questions/)).to.exist;
    screen.unmount();
  });

  it("App renders 'Sign in or create account' button if user NOT logged in", () => {
    const screen = renderInReduxProvider(<DhpApp />);
    expect(screen.getByText(/Sign in or create an account/)).to.exist;
  });

  xit('renders with "Devices" sections when user IS logged in', () => {
    const loggedInState = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };
    const screen = renderInReduxProvider(<DhpApp />, {
      initialState: loggedInState,
    });
    expect(screen.getByText(/Your connected devices/)).to.exist;
    expect(screen.getByText(/Devices you can connect/)).to.exist;
  });
});

// [Mock API] Redirect back to dhp page after create AND user logged in
// [Mock API] Redirect back to dhp page after login  AND user logged in
