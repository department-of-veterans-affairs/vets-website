import React from 'react';
import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';

import Avs from '../../containers/Avs';
import ErrorBoundary from '../../components/ErrorBoundary';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

describe('Avs container', () => {
  let oldLocation;

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      avs_enabled: false,
      loading: false,
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
  };
  const props = {
    params: {
      id: '9A7AF40B2BC2471EA116891839113252',
    },
  };

  it('user is not logged in', () => {
    // expected behavior is be redirected to the home page with next in the url
    renderWithStoreAndRouter(<Avs {...props} />, {
      initialState,
    });

    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq('/');
  });

  it('feature flags are still loading', () => {
    const screen = renderWithStoreAndRouter(<Avs {...props} />, {
      initialState: {
        ...initialState,
        featureToggles: {
          loading: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
      },
    });
    expect(screen.getByTestId('avs-loading-indicator'));
  });

  it('feature flag set to false', () => {
    renderWithStoreAndRouter(<Avs {...props} />, { initialState });
    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq('/');
  });

  it('feature flag set to true', async () => {
    mockApiRequest(mockAvs);
    const screen = renderWithStoreAndRouter(<Avs {...props} />, {
      initialState: {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          avs_enabled: true,
          loading: false,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            services: [backendServices.USER_PROFILE],
          },
        },
      },
    });
    await waitFor(() => {
      expect(screen.getByText('After-visit summary'));
    });
  });

  it('API request fails', async () => {
    mockApiRequest({}, false);
    const screen = renderWithStoreAndRouter(
      <ErrorBoundary>
        <Avs {...props} />
      </ErrorBoundary>,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            // eslint-disable-next-line camelcase
            avs_enabled: true,
            loading: false,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.USER_PROFILE],
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your after-visit summary right now'),
      );
    });
  });
});
