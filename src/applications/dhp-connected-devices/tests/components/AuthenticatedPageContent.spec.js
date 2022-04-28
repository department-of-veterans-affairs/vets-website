import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { AuthenticatedPageContent } from '../../components/AuthenticatedPageContent';

describe('as an authenticated user, landing page', () => {
  it('renders with "Devices" sections', () => {
    const loggedInState = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };
    const screen = renderInReduxProvider(<AuthenticatedPageContent />, {
      initialState: loggedInState,
    });
    expect(screen.getByText(/Your connected devices/)).to.exist;
    expect(screen.getByText(/Devices you can connect/)).to.exist;
  });
  it("renders 'Fitbit'", () => {
    const loggedInState = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };
    const screen = renderInReduxProvider(<AuthenticatedPageContent />, {
      initialState: loggedInState,
    });
    expect(screen.getByText(/Fitbit/)).to.exist;
  });
});
