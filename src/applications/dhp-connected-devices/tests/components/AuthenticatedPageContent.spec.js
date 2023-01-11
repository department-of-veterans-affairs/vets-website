import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { AuthenticatedPageContent } from '../../components/AuthenticatedPageContent';

describe('as an authenticated user, landing page', () => {
  const connectedDevicesList = {
    devices: [
      {
        name: 'Fitbit-1',
        key: 'fitbit',
        authUrl: 'path/to/vetsapi/vendor-1/connect/method',
        disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
        connected: true,
      },
      {
        name: 'vendor-2',
        key: 'vendor 2',
        authUrl: 'path/to/vetsapi/vendor-2/connect/method',
        disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
        connected: false,
      },
    ],
  };

  beforeEach(() => {
    mockApiRequest(connectedDevicesList);
  });

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
});
