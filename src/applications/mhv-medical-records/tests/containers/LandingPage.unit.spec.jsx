import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { addHours, format } from 'date-fns';
import * as uniqueUserMetrics from '~/platform/mhv/unique_user_metrics';
import LandingPage from '../../containers/LandingPage';
import reducer from '../../reducers';
import * as MrApi from '../../api/MrApi';

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

  describe('Landing Page without downtime', () => {
    let postCreateAALStub;
    let logUniqueUserMetricsEventsStub;
    let sandbox;
    let getByTestId;
    let screen;

    const customState = {
      drupalStaticData: {
        vamcEhrData: {
          loading: false,
        },
      },
      /* eslint-disable camelcase */
      featureToggles: {
        loading: false,
        mhv_medical_records_update_landing_page: true,
        mhv_landing_page_show_share_my_health_data_link: true,
      },
      /* eslint-enable camelcase */
      ...initialState,
    };

    const renderPage = () => {
      screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: customState,
        reducers: reducer,
      });
      getByTestId = screen.getByTestId;
    };

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      // stub out postCreateAAL so it doesn't actually fire network requests
      postCreateAALStub = sandbox.stub(MrApi, 'postCreateAAL');
      logUniqueUserMetricsEventsStub = sandbox.stub(
        uniqueUserMetrics,
        'logUniqueUserMetricsEvents',
      );
      renderPage();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('displays the appropriate sections', () => {
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
        screen.getByText('Manage your electronic sharing settings', {
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
      const settingsVaLinkAction = screen.getByTestId(
        'settings-landing-page-link',
      );
      expect(settingsVaLinkAction).to.exist;
      expect(
        screen.getByText('What to do if you can’t find your medical records', {
          selector: 'h2',
          exact: true,
        }),
      ).to.exist;
      const gpsVaLinkAction = screen.getByTestId('gps-landing-page-link');
      expect(gpsVaLinkAction).to.exist;
      expect(
        screen.getByText('Share personal health data with your care team', {
          selector: 'h2',
          exact: true,
        }),
      ).to.exist;

      // help section
      expect(
        screen.getByText('Need help?', {
          selector: 'h3',
          exact: true,
        }),
      ).to.exist;
    });

    const linkTests = [
      {
        testId: 'labs-and-tests-landing-page-link',
        activityType: 'Lab and test results',
      },
      {
        testId: 'notes-landing-page-link',
        activityType: 'Care Summaries and Notes',
      },
      { testId: 'vaccines-landing-page-link', activityType: 'Vaccines' },
      {
        testId: 'allergies-landing-page-link',
        activityType: 'Allergy and Reactions',
      },
      {
        testId: 'conditions-landing-page-link',
        activityType: 'Health Conditions',
      },
      { testId: 'vitals-landing-page-link', activityType: 'Vitals' },
    ];

    const clickAndAssert = (testId, activityType) => {
      fireEvent.click(getByTestId(testId));
      expect(postCreateAALStub.calledOnce).to.be.true;
      expect(
        postCreateAALStub.calledWithMatch({
          activityType,
          action: 'View',
          performerType: 'Self',
          status: 1,
          oncePerSession: true,
        }),
        `postCreateAAL called with correct payload for ${activityType}`,
      ).to.be.true;
    };

    linkTests.forEach(({ testId, activityType }) => {
      it(`calls postCreateAAL when ${activityType} link is clicked`, () => {
        clickAndAssert(testId, activityType);
      });
    });

    it('should log medical records accessed event when landing page loads', () => {
      expect(
        logUniqueUserMetricsEventsStub.calledWith(
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_ACCESSED,
        ),
      ).to.be.true;
    });

    const uniqueUserMetricsLinkTests = [
      {
        testId: 'labs-and-tests-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_LABS_ACCESSED,
        description: 'labs and tests',
      },
      {
        testId: 'notes-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_NOTES_ACCESSED,
        description: 'care summaries and notes',
      },
      {
        testId: 'vaccines-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_VACCINES_ACCESSED,
        description: 'vaccines',
      },
      {
        testId: 'allergies-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_ALLERGIES_ACCESSED,
        description: 'allergies and reactions',
      },
      {
        testId: 'conditions-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_CONDITIONS_ACCESSED,
        description: 'health conditions',
      },
      {
        testId: 'vitals-landing-page-link',
        eventType:
          uniqueUserMetrics.EVENT_REGISTRY.MEDICAL_RECORDS_VITALS_ACCESSED,
        description: 'vitals',
      },
    ];

    uniqueUserMetricsLinkTests.forEach(({ testId, eventType, description }) => {
      it(`should log unique user metrics event when ${description} link is clicked`, () => {
        // Reset the stub to clear previous calls
        logUniqueUserMetricsEventsStub.resetHistory();

        fireEvent.click(getByTestId(testId));

        expect(logUniqueUserMetricsEventsStub.calledWith(eventType)).to.be.true;
      });
    });
  });
});
