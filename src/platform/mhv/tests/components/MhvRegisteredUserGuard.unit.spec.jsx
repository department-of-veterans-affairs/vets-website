import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import { mockLocation } from 'platform/testing/unit/helpers';
import MhvRegisteredUserGuard from '../../components/MhvRegisteredUserGuard';

describe('MhvRegisteredUserGuard component', () => {
  let restoreLocation;

  beforeEach(() => {
    // Use mockLocation with cross-origin URL to get mock location with spy methods
    restoreLocation = mockLocation('https://www.va.gov/');
  });

  afterEach(() => {
    if (restoreLocation) {
      restoreLocation();
      restoreLocation = null;
    }
  });

  const initialState = {
    user: {
      profile: {
        verified: true,
        vaPatient: true,
        loa: {
          current: 3,
        },
      },
    },
  };

  const setup = (state = initialState, initialPath = '/') => {
    return renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: state,
        path: initialPath,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('redirects to /my-health when user is not LOA3', async () => {
    const customState = {
      user: {
        profile: {
          verified: true,
          vaPatient: true,
          loa: {
            current: 2,
          },
        },
      },
    };

    renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: customState,
        path: '/',
      },
    );

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('redirects to /my-health when user is not a patient', async () => {
    const customState = {
      user: {
        profile: {
          verified: true,
          vaPatient: false,
          loa: {
            current: 3,
          },
        },
      },
    };

    renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: customState,
        path: '/',
      },
    );

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });
});
