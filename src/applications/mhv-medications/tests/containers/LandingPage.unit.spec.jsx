import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import reducer from '../../reducers';
import prescriptions from '../fixtures/prescriptions.json';
import LandingPage from '../../containers/LandingPage';
import { medicationsUrls } from '../../util/constants';

describe('Medications Landing page container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionsList: prescriptions,
        prescriptionDetails: prescriptions,
        apiError: false,
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
  const setup = (state = initialState, path = '/') => {
    return renderWithStoreAndRouter(<LandingPage />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('About medications', {
        exact: true,
      }),
    ).to.exist;
  });

  it('displays subheader "what to know as you try out this tool"', () => {
    expect(
      screen.getByText('What to know as you try out this tool', {
        exact: true,
      }),
    ).to.exist;
  });
  it('displays subheader "More ways to manage your medications"', () => {
    expect(
      screen.getByText('More ways to manage your medications', {
        exact: true,
      }),
    ).to.exist;
  });

  it('opens accordion when url is "/about#accordion-renew-rx"', () => {
    const setupWithSpecificPathState = (
      state = {
        rx: {
          prescriptions: {
            prescriptionsList: prescriptions,
          },
          breadcrumbs: {
            list: [
              { url: medicationsUrls.MEDICATIONS_ABOUT },
              { label: 'About medications' },
            ],
          },
        },
        featureToggles: {
          loading: true,
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
      },
    ) => {
      return renderWithStoreAndRouter(<LandingPage />, {
        initialState: state,
        reducers: reducer,
        path: '#accordion-renew-rx',
      });
    };
    const newScreen = setupWithSpecificPathState();
    expect(
      newScreen.getByText(
        'This tool lists medications and supplies prescribed by your VA providers. It also lists medications and supplies prescribed by non-VA providers, if you filled them through a VA pharmacy.',
      ),
    ).to.exist;
  });

  it('page loads when loading flag is false and logged in status is false and user navigates to #accordion-renew-rx', () => {
    const setupWithSpecificFeatureToggleState = (
      state = {
        ...initialState,
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          mhv_medications_to_va_gov_release: true,
        },
        user: {
          login: {
            currentlyLoggedIn: false,
          },
          profile: {
            services: [backendServices.USER_PROFILE],
          },
        },
      },
    ) => {
      return renderWithStoreAndRouter(<LandingPage />, {
        initialState: state,
        reducers: reducer,
        path: '#accordion-renew-rx',
      });
    };
    const newScreen = setupWithSpecificFeatureToggleState();
    expect(newScreen.findByText('More ways to manage your medications.')).to
      .exist;
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
            prescriptionsList: prescriptions,
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
    ).to.equal(medicationsUrls.subdirectories.BASE);
  });
  it('The user doesn’t have any medications', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(<LandingPage />, {
      initialState: {
        rx: {
          prescriptions: {
            prescriptionsList: [],
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
      screenFeatureToggle.getByText(
        'You don’t have any VA prescriptions or medication records',
      ),
    ).to.exist;
  });
  describe('allergies feature flag', () => {
    const allergiesFFInitialState = {
      rx: {
        prescriptions: {
          prescriptionsList: [],
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
        // eslint-disable-next-line camelcase
        mhv_medications_display_allergies: true,
      },
    };

    const setupWithAllergyFeaturetoggle = (
      state = allergiesFFInitialState,
      path = '/',
    ) => {
      return renderWithStoreAndRouter(<LandingPage />, {
        initialState: state,
        reducers: reducer,
        path,
      });
    };

    it('displays "Go to your allergies and reactions" link when show allergies feature flag is true', () => {
      expect(
        setupWithAllergyFeaturetoggle().getByText(
          'Go to your allergies and reactions',
        ),
      );
    });

    it('displays "Go to your allergy and reaction records on the My HealtheVet website" link when show allergies feature flag is false', () => {
      const newScreenWithAllergyFeatureToggleOff = setupWithAllergyFeaturetoggle(
        {
          ...allergiesFFInitialState,
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
            // eslint-disable-next-line camelcase
            mhv_medications_display_allergies: false,
          },
        },
      );
      expect(
        newScreenWithAllergyFeatureToggleOff.getByText(
          'Go to your allergy and reaction records on the My HealtheVet website',
        ),
      );
    });
  });
});
