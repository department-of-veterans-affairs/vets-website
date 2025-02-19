import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { addHours, format } from 'date-fns';
import LandingPage from '../../containers/LandingPage';
import reducer from '../../reducers';

describe('Landing Page', () => {
  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        // services: [backendServices.HEALTH_RECORDS],
      },
    },
    mr: {
      breadcrumbs: {
        list: [],
      },
    },
  };

  const downtimeApproaching = maintenanceWindows => {
    return createServiceMap(
      maintenanceWindows.map(maintenanceWindow => {
        return {
          attributes: {
            externalService: maintenanceWindow,
            status: 'downtimeApproaching',
            startTime: format(addHours(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addHours(new Date(), 3), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        };
      }),
    );
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<LandingPage />, {});
    expect(screen).to.exist;
  });

  it('displays downtimeNotification when downtimeApproaching is true', () => {
    const customState = {
      featureToggles: {
        loading: false,
      },
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
        },
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: downtimeApproaching(['mhv_mr']),
        dismissedDowntimeWarnings: [],
      },
      ...initialState,
    };

    const screen = renderWithStoreAndRouter(<LandingPage />, {
      initialState: customState,
      reducers: reducer,
    });

    expect(
      screen.getByText('Upcoming maintenance on My HealtheVet', {
        selector: 'h2',
        exact: true,
      }),
    );
    expect(
      screen.getByText(
        'We’ll be working on My HealtheVet soon. The maintenance will last 2 hours',
        {
          exact: false,
        },
      ),
    );
  });

  it('displays features as h2s with links below when feature flags are true', () => {
    const customState = {
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
        },
      },
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_conditions: true,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_labs_and_tests: true,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_notes: true,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_vaccines: true,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_vitals: true,
        // eslint-disable-next-line camelcase
        mhv_medical_records_display_settings_page: true,
      },
      ...initialState,
    };

    const screen = renderWithStoreAndRouter(<LandingPage />, {
      initialState: customState,
      reducers: reducer,
    });

    // feature h2s
    expect(
      screen.getByText('Lab and test results', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Care summaries and notes', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Vaccines', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Allergies and reactions', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Health conditions', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Vitals', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText('Manage your medical records settings', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;

    // links to features
    expect(
      screen.getByRole('link', {
        name: 'Go to your care summaries and notes',
      }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: 'Go to your vaccines',
      }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: 'Go to your allergies and reactions',
      }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: 'Go to your health conditions',
      }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: 'Go to your vitals',
      }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: 'Go to your medical records settings',
      }),
    ).to.exist;
    // expect(
    //   screen.getAllByText('Go to your medical records settings', {
    //     selector: 'a',
    //     exact: true,
    //   }).length,
    // ).to.eq(2);
  });

  it('displays Questions about this medical records tool section', () => {
    const screen = renderWithStoreAndRouter(<LandingPage />, {});

    expect(
      screen.getByText('Questions about this medical records tool', {
        selector: 'h2',
        exact: true,
      }),
    ).to.exist;

    expect(
      screen.getByText(
        'Where can I find health information I entered myself?',
        {
          selector: 'h3',
          exact: true,
        },
      ),
    ).to.exist;

    expect(
      screen.getAllByText(
        'Go to your medical records on the My HealtheVet website',
        {
          selector: 'a',
          exact: true,
        },
      ),
    ).to.exist;
  });
});
