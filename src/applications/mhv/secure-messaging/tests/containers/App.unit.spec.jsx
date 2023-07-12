import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';
import App from '../../containers/App';
import reducer from '../../reducers';

describe('App', () => {
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
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MESSAGING],
      },
    },
    sm: {
      breadcrumbs: {
        list: [],
      },
    },
  };

  it('user is not logged in', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
      },
      path: `/`,
      reducers: reducer,
    });
    screen.debug();
    expect(
      screen.getByText('Loading your information...', {
        selector: 'div',
        exact: true,
      }),
    );
  });

  it('feature flags are still loading', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          loading: true,
        },
        ...initialState,
      },
      path: `/`,
      reducers: reducer,
    });
    expect(screen.getByTestId('feature-flag-loading-indicator'));
  });

  it('feature flag set to false', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: false,
        },
        ...initialState,
      },
      path: `/`,
      reducers: reducer,
    });
    expect(
      screen.queryByText(
        'Communicate privately and securely with your VA health care team online.',
      ),
    ).to.be.null;
    expect(screen.queryByText('Messages', { selector: 'h1', exact: true })).to
      .be.null;
    expect(window.location.replace.calledOnce).to.be.true;
  });

  it('feature flag set to true', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    expect(screen.getByText('Messages', { selector: 'h1', exact: true }));
    expect(
      screen.getByText(
        'Communicate privately and securely with your VA health care team online.',
      ),
    );
  });
});
