import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import reducer from '../../reducers';
import prescriptions from '../fixtures/prescriptions.json';
import LandingPage from '../../containers/LandingPage';
import { medicationsUrls } from '../../util/constants';

describe('Medicaitons Landing page container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: prescriptions,
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      mhv_medications_to_va_gov_release: true,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.USER_PROFILE],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LandingPage />, {
      initialState: state,
      reducers: reducer,
      path: '/',
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('About medications', {
        exact: true,
      }),
    ).to.exist;
  });

  it('What to know as you try out this tool', () => {
    expect(
      screen.getByText('What to know as you try out this tool', {
        exact: true,
      }),
    ).to.exist;
  });
  it('More ways to manage your medications', () => {
    expect(
      screen.getByText('More ways to manage your medications', {
        exact: true,
      }),
    ).to.exist;
  });
});

describe('App-level feature flag functionality', () => {
  const initialStateFeatureFlag = (loading = true, flag = true) => {
    return {
      initialState: {
        featureToggles: {
          loading,
          // eslint-disable-next-line camelcase
          mhv_medications_to_va_gov_release: flag,
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
      path: `/`,
      reducers: reducer,
    };
  };

  it('feature flags are still loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <LandingPage />,
      initialStateFeatureFlag(),
    );
    expect(
      screenFeatureToggle.getByTestId('rx-feature-flag-loading-indicator'),
    );
  });

  it('feature flag set to false', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <LandingPage />,
      initialStateFeatureFlag(false, false),
    );
    expect(screenFeatureToggle.queryByText('About medications')).to.be.null;
    expect(
      screenFeatureToggle.queryByText(
        'Learn how to manage your VA prescriptions and review your medications list.',
      ),
    ).to.be.null;
  });

  it('feature flag set to true', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <LandingPage />,
      initialStateFeatureFlag(false, true),
    );
    expect(
      screenFeatureToggle.getAllByText('About medications', {
        selector: 'h1',
        exact: true,
      }),
    );
    expect(
      screenFeatureToggle.getAllByText(
        'Learn how to manage your VA prescriptions and review your medications list.',
      ),
    );
  });

  it('should maintain login status', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(<LandingPage />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionDetails: prescriptions,
          },
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            services: [backendServices.USER_PROFILE],
          },
        },
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          mhv_medications_to_va_gov_release: true,
        },
      },
      reducers: reducer,
      path: '/',
    });
    expect(
      screenFeatureToggle
        .getByTestId('prescriptions-nav-link')
        .getAttribute('href'),
    ).to.equal(medicationsUrls.MEDICATIONS_URL);
  });
});
