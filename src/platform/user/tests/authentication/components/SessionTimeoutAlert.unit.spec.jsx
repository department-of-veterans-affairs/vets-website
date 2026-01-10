import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { mockLocation } from 'platform/testing/unit/helpers';
import SessionTimeoutAlert from 'platform/user/authentication/components/SessionTimeoutAlert';

const generateState = ({ statuses = [], maintenanceWindows = [] }) => ({
  externalServiceStatuses: {
    statuses,
    maintenanceWindows,
  },
});

describe('SessionTimeoutAlert', () => {
  it('does not render when no query parameters are provided', () => {
    const screen = renderInReduxProvider(<SessionTimeoutAlert />, {
      initialState: generateState({}),
    });

    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.be.null;
  });

  it('renders when session has expired and there is no downtime', () => {
    // Use mockLocation for JSDOM 22+ compatibility
    const restoreLocation = mockLocation('http://localhost/?status=session_expired');

    const screen = renderInReduxProvider(<SessionTimeoutAlert />, {
      initialState: generateState({}),
    });

    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.not.be.null;
    restoreLocation();
  });

  it('does not render when session has expired but there is downtime', () => {
    // Use mockLocation for JSDOM 22+ compatibility
    const restoreLocation = mockLocation('http://localhost/?status=session_expired');

    const screen = renderInReduxProvider(<SessionTimeoutAlert />, {
      initialState: generateState({
        statuses: [{ serviceId: 'idme', status: 'down' }],
      }),
    });
    expect(
      screen.queryByText(/Your session timed out. Sign in again to continue./i),
    ).to.be.null;
    restoreLocation();
  });
});
