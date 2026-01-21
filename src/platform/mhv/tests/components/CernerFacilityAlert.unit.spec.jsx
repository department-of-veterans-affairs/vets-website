import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import CernerFacilityAlert from '../../components/CernerFacilityAlert/CernerFacilityAlert';
import {
  CernerAlertContent,
  PretransitionedFacilitiesByVhaId,
} from '../../components/CernerFacilityAlert/constants';
import mockData from '../fixtures/cerner-facility-mock-data.json';

describe('CernerFacilityAlert', () => {
  const initialState = {
    drupalStaticData: mockData.drupalStaticData,
    user: {
      profile: {
        facilities: [],
        userAtPretransitionedOhFacility: true,
        userFacilityReadyForInfoAlert: false,
        userFacilityMigratingToOh: false,
        migrationSchedules: [],
      },
    },
  };

  const setup = (state = initialState, props = {}) => {
    return renderWithStoreAndRouter(<CernerFacilityAlert {...props} />, {
      initialState: state,
    });
  };

  describe('when user has no Cerner facilities', () => {
    it('does not render alert', () => {
      const screen = setup(
        {
          ...initialState,
          user: {
            profile: {
              facilities: [],
              userAtPretransitionedOhFacility: false,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: false,
              migrationSchedules: [],
            },
          },
        },
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('when user has one Cerner facility', () => {
    const stateWithOneFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('renders alert with single facility text', () => {
      const screen = setup(
        stateWithOneFacility,
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      expect(screen.getByTestId('single-cerner-facility-text')).to.exist;

      // Verify facility is in PretransitionedFacilitiesByVhaId constant
      const facilityId = '668';
      expect(PretransitionedFacilitiesByVhaId[facilityId]).to.exist;
      const expectedName =
        PretransitionedFacilitiesByVhaId[facilityId].vamcSystemName;
      expect(screen.getByText(expectedName, { exact: false })).to.exist;
    });

    it('displays correct domain text in body', () => {
      const screen = setup(stateWithOneFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      const bodyText = screen.getByTestId('single-cerner-facility-text')
        .textContent;
      expect(bodyText).to.include('medications');
    });

    it('displays facility name in bold', () => {
      const screen = setup(
        stateWithOneFacility,
        CernerAlertContent.MEDICATIONS,
      );

      // Verify facility is in PretransitionedFacilitiesByVhaId constant
      const facilityId = '668';
      expect(PretransitionedFacilitiesByVhaId[facilityId]).to.exist;
      const expectedName =
        PretransitionedFacilitiesByVhaId[facilityId].vamcSystemName;

      const facilityElement = screen.getByText(expectedName);
      expect(facilityElement.tagName).to.equal('STRONG');
    });
  });

  describe('when user has multiple Cerner facilities', () => {
    const stateWithMultipleFacilities = {
      ...initialState,
      user: {
        profile: {
          facilities: [
            { facilityId: '668', isCerner: true },
            { facilityId: '692', isCerner: true },
          ],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('renders alert with list of facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      const facilityList = screen.getAllByTestId('cerner-facility');
      expect(facilityList.length).to.equal(2);
    });

    it('displays all facility names', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      // Verify both facilities are in PretransitionedFacilitiesByVhaId constant
      const facility1Id = '668';
      const facility2Id = '692';
      expect(PretransitionedFacilitiesByVhaId[facility1Id]).to.exist;
      expect(PretransitionedFacilitiesByVhaId[facility2Id]).to.exist;

      const facility1Name =
        PretransitionedFacilitiesByVhaId[facility1Id].vamcSystemName;
      const facility2Name =
        PretransitionedFacilitiesByVhaId[facility2Id].vamcSystemName;

      expect(screen.getByText(facility1Name)).to.exist;
      expect(screen.getByText(facility2Name)).to.exist;
    });

    it('displays correct plural text for multiple facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      const headingText = screen.getAllByText(/these facilities/i);
      expect(headingText).to.exist;
    });
  });

  describe('link behavior', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('renders My VA Health link with correct href', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const link = screen.getByTestId('cerner-facility-action-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.include(
        '/pages/medications/current',
      );
    });

    it('calls onLinkClick callback when provided', () => {
      const onLinkClick = sinon.spy();
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
        onLinkClick,
      });

      const link = screen.getByTestId('cerner-facility-action-link');
      link.click();

      expect(onLinkClick.calledOnce).to.be.true;
    });

    it('has proper security attributes', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const link = screen.getByTestId('cerner-facility-action-link');
      expect(link.getAttribute('rel')).to.equal('noopener noreferrer');
    });
  });

  describe('with custom text props', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('respects custom props', () => {
      const screen = setup(stateWithFacility, {
        linkPath: '/custom/path',
        domain: 'tests',
        headline: 'To manage test page from',
        bodyIntro: 'Custom intro text.',
        bodyActionSingle: 'Custom single action',
      });

      expect(screen.getAllByText(/To manage test page from this facility/i)).to
        .exist;
      expect(screen.getByText(/Custom intro text/i)).to.exist;
      expect(screen.getByText(/Custom single action/i)).to.exist;
    });
  });

  describe('with apiError prop', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('adds extra margin when apiError is true', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        apiError: true,
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
    });
  });

  describe('alert styling', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('has warning status', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('status')).to.equal('warning');
    });

    it('applies custom className', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        className: 'custom-test-class',
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('class')).to.include('custom-test-class');
    });
  });

  describe('with forceHideInfoAlert prop', () => {
    it('shows standard yellow alert when forceHideInfoAlert is true even when info flag is true', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHideInfoAlert: true,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    });

    it('shows info alert when forceHideInfoAlert is false', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHideInfoAlert: false,
      });

      expect(screen.getByTestId('cerner-facilities-info-alert')).to.exist;
    });
  });

  describe('with forceHidePretransitionedAlert prop', () => {
    it('hides pretransitioned alert when forceHidePretransitionedAlert is true', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHidePretransitionedAlert: true,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      expect(screen.queryByTestId('cerner-facilities-info-alert')).to.not.exist;
    });

    it('shows pretransitioned alert when forceHidePretransitionedAlert is false', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHidePretransitionedAlert: false,
      });

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
    });
  });

  describe('info alert behavior', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: true,
          userFacilityMigratingToOh: false,
          migrationSchedules: [],
        },
      },
    };

    it('renders the info alert when userFacilityReadyForInfoAlert flag is true', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert).to.exist;
      expect(infoAlert.getAttribute('status')).to.equal('info');
      // Trigger should use the provided infoAlertActionPhrase from props
      expect(infoAlert.getAttribute('trigger')).to.equal(
        `You can now ${
          CernerAlertContent.MEDICATIONS.infoAlertActionPhrase
        } for all VA facilities right here`,
      );
      expect(screen.getByTestId('cerner-facility-info-text')).to.exist;
    });

    it('adds margin class when apiError is true on info alert', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        apiError: true,
      });

      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert.getAttribute('class')).to.include(
        'vads-u-margin-top--2',
      );
    });

    it('uses infoAlertHeadline when provided (Secure Messaging)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
      });

      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert).to.exist;
      // When infoAlertHeadline is supplied, the trigger should exactly match it
      expect(infoAlert.getAttribute('trigger')).to.equal(
        CernerAlertContent.SECURE_MESSAGING.infoAlertHeadline,
      );
    });

    it('displays composed text with infoAlertText when provided (Medications)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      expect(infoText.textContent).to.include(
        `We've brought all your VA health care data together so you can manage your care in one place.`,
      );
      expect(infoText.textContent).to.include(
        CernerAlertContent.MEDICATIONS.infoAlertText,
      );
    });

    it('displays composed text with infoAlertText when provided (Secure Messaging)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      expect(infoText.textContent).to.include(
        `We've brought all your VA health care data together so you can manage your care in one place.`,
      );
      expect(infoText.textContent).to.include(
        CernerAlertContent.SECURE_MESSAGING.infoAlertText,
      );
    });

    it('displays only base text when infoAlertText is not provided', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MHV_LANDING_PAGE,
        domain: 'test-domain', // Override domain to allow alert to render
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      const baseText = `We've brought all your VA health care data together so you can manage your care in one place.`;
      expect(infoText.textContent).to.include(baseText);
      // Verify no additional text is appended after the base message
      expect(infoText.textContent).to.include('Still want to use My VA Health');
    });
  });

  describe('migrating facilities functionality', () => {
    const mockMigrationInfo = [
      {
        migrationDate: '2026-05-01',
        facilities: [
          {
            facilityId: '528',
            facilityName: 'VA New Orleans Medical Center',
          },
        ],
        phases: {
          current: 'p1',
          p0: 'March 1, 2026',
          p1: 'March 15, 2026',
          p2: 'April 1, 2026',
          p3: 'April 24, 2026',
          p4: 'April 27, 2026',
          p5: 'May 1, 2026',
          p6: 'May 8, 2026',
        },
      },
    ];

    describe('when userFacilityMigratingToOh is true', () => {
      const stateWithMigratingFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '528' }],
            userAtPretransitionedOhFacility: false,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: true,
            migrationSchedules: mockMigrationInfo,
          },
        },
      };

      it('renders MigratingFacilitiesAlerts component', () => {
        const screen = setup(
          stateWithMigratingFacility,
          CernerAlertContent.MEDICATIONS,
        );

        // Should render the transition alert from MigratingFacilitiesAlerts
        expect(screen.getByTestId('cerner-facilities-transition-alert')).to
          .exist;
      });

      it('passes correct props to MigratingFacilitiesAlerts', () => {
        const screen = setup(
          stateWithMigratingFacility,
          CernerAlertContent.MEDICATIONS,
        );

        const alert = screen.getByTestId('cerner-facilities-transition-alert');
        expect(alert).to.exist;
        expect(alert.getAttribute('status')).to.equal('warning');
      });

      it('does not render standard Cerner alert when migrating', () => {
        const stateWithBoth = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: true,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: true,
              migrationSchedules: mockMigrationInfo,
            },
          },
        };

        const screen = setup(stateWithBoth, CernerAlertContent.MEDICATIONS);

        // Should render migration alert, not standard Cerner alert
        expect(screen.getByTestId('cerner-facilities-transition-alert')).to
          .exist;
        expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      });

      it('respects forceHideTransitionAlert prop', () => {
        const screen = setup(stateWithMigratingFacility, {
          ...CernerAlertContent.MEDICATIONS,
          forceHideTransitionAlert: true,
        });

        // Should not render transition alert when forced to hide
        expect(screen.queryByTestId('cerner-facilities-transition-alert')).to
          .not.exist;
      });

      it('shows pretransitioned alert when forceHideTransitionAlert is true and user has pretransitioned facilities', () => {
        const stateWithBoth = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: true,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: true,
              migrationSchedules: mockMigrationInfo,
            },
          },
        };

        const screen = setup(stateWithBoth, {
          ...CernerAlertContent.MEDICATIONS,
          forceHideTransitionAlert: true,
        });

        // Should fall through to pretransitioned alert when migration alert is hidden
        expect(screen.queryByTestId('cerner-facilities-transition-alert')).to
          .not.exist;
        expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      });

      it('handles empty migrationSchedules array', () => {
        const stateWithEmptyMigration = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '528' }],
              userAtPretransitionedOhFacility: false,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: true,
              migrationSchedules: [],
            },
          },
        };

        const screen = setup(
          stateWithEmptyMigration,
          CernerAlertContent.MEDICATIONS,
        );

        // Should not render any alert with empty migration info
        expect(screen.queryByTestId('cerner-facilities-transition-alert')).to
          .not.exist;
      });
    });

    describe('priority order of alerts', () => {
      it('shows migration alert over standard Cerner alert', () => {
        const stateWithBoth = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: true,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: true,
              migrationSchedules: mockMigrationInfo,
            },
          },
        };

        const screen = setup(stateWithBoth, CernerAlertContent.MEDICATIONS);

        expect(screen.getByTestId('cerner-facilities-transition-alert')).to
          .exist;
        expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      });

      it('shows migration alert over info alert', () => {
        const stateWithBoth = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: true,
              userFacilityReadyForInfoAlert: true,
              userFacilityMigratingToOh: true,
              migrationSchedules: mockMigrationInfo,
            },
          },
        };

        const screen = setup(stateWithBoth, CernerAlertContent.MEDICATIONS);

        expect(screen.getByTestId('cerner-facilities-transition-alert')).to
          .exist;
        expect(screen.queryByTestId('cerner-facilities-info-alert')).to.not
          .exist;
      });

      it('shows info alert when migration flag is false', () => {
        const stateWithInfoOnly = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: true,
              userFacilityReadyForInfoAlert: true,
              userFacilityMigratingToOh: false,
            },
          },
        };

        const screen = setup(stateWithInfoOnly, CernerAlertContent.MEDICATIONS);

        expect(screen.getByTestId('cerner-facilities-info-alert')).to.exist;
        expect(screen.queryByTestId('cerner-facilities-transition-alert')).to
          .not.exist;
      });
    });

    describe('when no flags are true', () => {
      it('does not render any alert', () => {
        const stateWithNoFlags = {
          ...initialState,
          user: {
            profile: {
              facilities: [{ facilityId: '668', isCerner: true }],
              userAtPretransitionedOhFacility: false,
              userFacilityReadyForInfoAlert: false,
              userFacilityMigratingToOh: false,
            },
          },
        };

        const screen = setup(stateWithNoFlags, CernerAlertContent.MEDICATIONS);

        expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
        expect(screen.queryByTestId('cerner-facilities-info-alert')).to.not
          .exist;
        expect(screen.queryByTestId('cerner-facilities-transition-alert')).to
          .not.exist;
      });
    });
  });
});
