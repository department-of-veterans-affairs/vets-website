import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import App from '../../containers/App';

describe('App', () => {
  it('feature flag set to undefined', () => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_secure_messaging_to_va_gov_release: undefined,
      },
    };
    const screen = renderWithStoreAndRouter(<App />, {
      initialState,
      path: `/`,
    });
    expect(screen.getByTestId('feature-flag-undefined'));
  });
  it('feature flag set to false', () => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_secure_messaging_to_va_gov_release: false,
      },
    };
    const screen = renderWithStoreAndRouter(<App />, {
      initialState,
      path: `/`,
    });
    expect(screen.getByTestId('feature-flag-false'));
  });
  it('feature flag set to true', () => {
    const initialState = {
      featureToggles: {
        sm: {},
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        // eslint-disable-next-line camelcase
        mhv_secure_messaging_to_va_gov_release: true,
      },
    };
    const screen = renderWithStoreAndRouter(<App />, {
      initialState,
      path: `/`,
    });
    expect(screen.getByTestId('feature-flag-true'));
  });
});
