import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
// import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';
import App from '../../containers/App';
import LandingPage from '../../containers/LandingPage';
import reducer from '../../reducers';
import ResizeObserver from '../fixtures/mocks/ResizeObserver';

global.ResizeObserver = ResizeObserver;

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

  it('user is not logged in', () => {
    // expected behavior is be redirected to the home page with next in the url
    renderWithStoreAndRouter(<App />, {
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

    expect(window.location.replace.calledOnce).to.be.true;
  });

  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        // services: [backendServices.HEALTH_RECORDS],
      },
    },
    sm: {
      breadcrumbs: {
        list: [],
      },
    },
  };

  describe('App-level feature flag functionality', () => {
    it('feature flags are still loading', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            featureToggles: {
              loading: true,
            },
            ...initialState,
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(screen.getByTestId('mr-feature-flag-loading-indicator'));
    });

    it('feature flag set to false', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_to_va_gov_release: false,
            },
            ...initialState,
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(
        screen.queryByText('Medical records', {
          selector: 'h1',
          exact: true,
        }),
      ).to.be.null;
      expect(
        screen.queryByText(
          'Review, print, and download your VA medical records.',
        ),
      ).to.be.null;
      expect(window.location.replace.calledOnce).to.be.true;
    });

    it('feature flag set to true', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_to_va_gov_release: true,
            },
            ...initialState,
          },
          reducers: reducer,
          path: `/`,
        },
      );
      expect(
        screen.getAllByText('Medical records', {
          selector: 'h1',
          exact: true,
        }),
      );
      expect(
        screen.getAllByText(
          'Review, print, and download your VA medical records.',
        ),
      );
    });
  });

  describe('App-level feature flag functionality', () => {
    it('feature flag set to false', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_display_sidenav: false,
            },
            ...initialState,
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(screen.queryByTestId('mhv-mr-navigation')).to.be.null;
    });

    it('feature flag set to true', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_display_sidenav: true,
            },
            ...initialState,
          },
          reducers: reducer,
          path: `/`,
        },
      );
      expect(screen.queryByTestId('mhv-mr-navigation'));
    });
  });
});
