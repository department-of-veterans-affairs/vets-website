import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { addHours, format } from 'date-fns';
import LandingPage, {
  ALLERGIES_AND_REACTIONS_LABEL,
  CARE_SUMMARIES_AND_NOTES_LABEL,
  HEALTH_CONDITIONS_LABEL,
  MEDICAL_RECORDS_REQUEST_LABEL,
  MEDICAL_RECORDS_SETTINGS_LABEL,
  VACCINES_LABEL,
  VITALS_LABEL,
} from '../../containers/LandingPage';
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

      const notesVaLinkAction = screen.getByTestId('notes-landing-page-link');
      expect(notesVaLinkAction).to.exist;
      expect(notesVaLinkAction).to.have.attribute(
        'text',
        CARE_SUMMARIES_AND_NOTES_LABEL,
      );
      const allergiesVaLinkAction = screen.getByTestId(
        'allergies-landing-page-link',
      );
      expect(allergiesVaLinkAction).to.exist;
      expect(allergiesVaLinkAction).to.have.attribute(
        'text',
        ALLERGIES_AND_REACTIONS_LABEL,
      );
      const vaccinesVaLinkAction = screen.getByTestId(
        'vaccines-landing-page-link',
      );
      expect(vaccinesVaLinkAction).to.exist;
      expect(vaccinesVaLinkAction).to.have.attribute('text', VACCINES_LABEL);
      const reactionsVaLinkAction = screen.getByTestId(
        'conditions-landing-page-link',
      );
      expect(reactionsVaLinkAction).to.exist;
      expect(reactionsVaLinkAction).to.have.attribute(
        'text',
        HEALTH_CONDITIONS_LABEL,
      );
      const conditionsVaLinkAction = screen.getByTestId(
        'conditions-landing-page-link',
      );
      expect(conditionsVaLinkAction).to.exist;
      expect(conditionsVaLinkAction).to.have.attribute(
        'text',
        HEALTH_CONDITIONS_LABEL,
      );
      const vitalsVaLinkAction = screen.getByTestId('vitals-landing-page-link');
      expect(vitalsVaLinkAction).to.exist;
      expect(vitalsVaLinkAction).to.have.attribute('text', VITALS_LABEL);
      const settingsVaLinkAction = screen.getByTestId(
        'settings-landing-page-link',
      );
      expect(settingsVaLinkAction).to.exist;
      expect(settingsVaLinkAction).to.have.attribute(
        'text',
        MEDICAL_RECORDS_SETTINGS_LABEL,
      );
      expect(
        screen.getByText('What to do if you can’t find your medical records', {
          selector: 'h2',
          exact: true,
        }),
      ).to.exist;
      const gpsVaLinkAction = screen.getByTestId('gps-landing-page-link');
      expect(gpsVaLinkAction).to.exist;
      expect(gpsVaLinkAction).to.have.attribute(
        'text',
        MEDICAL_RECORDS_REQUEST_LABEL,
      );
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
  });

  describe('Cerner facility alert on Landing Page', () => {
    const cernerUserState = {
      user: {
        profile: {
          userFullName: {
            first: 'Andrew- Cerner',
            middle: 'J',
            last: 'Morkel',
          },
          facilities: [
            {
              facilityId: '668',
              isCerner: true,
            },
          ],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {
              '668': {
                vhaId: '668',
                vamcFacilityName:
                  'Mann-Grandstaff Department of Veterans Affairs Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
            },
            cernerFacilities: [
              {
                vhaId: '668',
                vamcFacilityName:
                  'Mann-Grandstaff Department of Veterans Affairs Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
            ],
          },
          loading: false,
        },
      },
    };

    const multipleCernerFacilitiesState = {
      user: {
        profile: {
          facilities: [
            { facilityId: '668', isCerner: true },
            { facilityId: '692', isCerner: true },
          ],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {
              '668': {
                vhaId: '668',
                vamcFacilityName:
                  'Mann-Grandstaff Department of Veterans Affairs Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
              '692': {
                vhaId: '692',
                vamcFacilityName: 'White City VA Medical Center',
                vamcSystemName: 'VA Southern Oregon health care',
                ehr: 'cerner',
              },
            },
            cernerFacilities: [
              {
                vhaId: '668',
                vamcFacilityName:
                  'Mann-Grandstaff Department of Veterans Affairs Medical Center',
                vamcSystemName: 'VA Spokane health care',
                ehr: 'cerner',
              },
              {
                vhaId: '692',
                vamcFacilityName: 'White City VA Medical Center',
                vamcSystemName: 'VA Southern Oregon health care',
                ehr: 'cerner',
              },
            ],
          },
          loading: false,
        },
      },
    };

    it('displays Cerner facility alert for Cerner users on landing page', () => {
      const screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: cernerUserState,
        reducers: reducer,
      });

      expect(screen).to.exist;
      expect(screen.getByTestId('mr-landing-page-title')).to.exist;
      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });

    it('renders Cerner alert text for single Cerner facility on landing page', () => {
      const screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: cernerUserState,
        reducers: reducer,
      });

      expect(screen.getByTestId('single-cerner-facility-text')).to.exist;
      const facilityElement = screen.getByText('VA Spokane health care');
      expect(facilityElement.tagName).to.equal('STRONG');
      const link = screen.getByTestId('cerner-facility-action-link');
      expect(link).to.exist;
    });

    it('renders Cerner alert for multiple Cerner facilities on landing page', () => {
      const screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: multipleCernerFacilitiesState,
        reducers: reducer,
      });

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      expect(screen.getAllByTestId('cerner-facility').length).to.be.greaterThan(
        1,
      );
    });

    it('displays Info facility alert for transitioned users on landing page', () => {
      const screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: {
          ...cernerUserState,
          user: {
            profile: {
              ...cernerUserState.user.profile,
              userFacilityReadyForInfoAlert: true,
            },
          },
        },
        reducers: reducer,
      });

      expect(screen.getByTestId('cerner-facilities-info-alert')).to.exist;
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });

    it('does not display Cerner alert for non-Cerner users on landing page', () => {
      const nonCernerUserState = {
        user: {
          profile: {
            facilities: [
              {
                facilityId: '516',
                isCerner: false,
              },
            ],
            userAtPretransitionedOhFacility: false,
            userFacilityReadyForInfoAlert: false,
          },
        },
        drupalStaticData: {
          vamcEhrData: {
            data: {
              ehrDataByVhaId: {
                '516': {
                  vhaId: '516',
                  vamcFacilityName:
                    'C.W. Bill Young Department of Veterans Affairs Medical Center',
                  vamcSystemName: 'VA Bay Pines health care',
                  ehr: 'vista',
                },
              },
            },
            loading: false,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<LandingPage />, {
        initialState: nonCernerUserState,
        reducers: reducer,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      expect(screen.queryByTestId('cerner-facilities-info-alert')).to.not.exist;
    });
  });
});
