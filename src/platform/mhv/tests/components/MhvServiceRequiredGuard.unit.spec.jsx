import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { waitFor } from '@testing-library/dom';
import { mockLocation } from 'platform/testing/unit/helpers';
import MhvServiceRequiredGuard from '../../components/MhvServiceRequiredGuard';

describe('MhvServiceRequiredGuard component', () => {
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
        services: ['messaging'],
        verified: true,
      },
    },
  };

  const initialProps = {
    serviceRequired: [backendServices.MESSAGING],
  };

  const setup = (
    props = initialProps,
    state = initialState,
    initialPath = '/',
  ) => {
    const componentProps = { ...props, user: { ...state.user } };
    return renderWithStoreAndRouter(
      <>
        <MhvServiceRequiredGuard {...componentProps} />
      </>,
      {
        initialState: state,
        path: initialPath,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup(undefined, undefined, '/');
    expect(screen);
  });

  it('redirects to /my-health when user is not verified', async () => {
    const customState = {
      user: {
        profile: {
          services: ['messaging'],
          verified: false,
        },
      },
    };

    const customProps = {
      user: { ...customState.user },
      serviceRequired: [backendServices.MESSAGING],
    };
    renderWithStoreAndRouter(
      <>
        <MhvServiceRequiredGuard {...customProps} />
      </>,
      {
        initialState: customState,
        path: '/',
      },
    );

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('redirects to /my-health when user has no services', async () => {
    const customState = {
      user: {
        profile: {
          services: ['messaging'],
          verified: true,
        },
      },
    };

    const customProps = {
      user: { ...customState.user },
      serviceRequired: [],
    };
    renderWithStoreAndRouter(
      <>
        <MhvServiceRequiredGuard {...customProps} />
      </>,
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
