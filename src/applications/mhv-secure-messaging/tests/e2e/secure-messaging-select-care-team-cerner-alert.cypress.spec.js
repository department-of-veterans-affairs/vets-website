import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/threads-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockToggles from './fixtures/toggles-response.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';
import mockUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import { AXE_CONTEXT, Paths } from './utils/constants';
import {
  createUserWithMigrationInfo,
  customRecipients,
} from './utils/user-helpers';

describe('Secure Messaging - Select Care Team Cerner Facility Alert', () => {
  const customFeatureToggles = {
    ...mockToggles,
    data: {
      ...mockToggles.data,
      features: [
        ...mockToggles.data.features,
        {
          name: 'mhv_secure_messaging_curated_list_flow',
          value: true,
        },
      ],
    },
  };

  it('verifies Cerner facility alert is present on Select care team page', () => {
    const mockUserWithMigrationInfo = createUserWithMigrationInfo(
      mockUser,
      {
        userAtPretransitionedOhFacility: false,
        userFacilityMigratingToOh: true,
        userFacilityReadyForInfoAlert: false,
        migrationSchedules: [
          {
            facilities: [
              {
                facilityId: '979',
                facilityName: 'Test 1',
              },
            ],
            phases: {
              current: 'p4',
              p0: 'December 28, 2025 at 12:00AM ET',
              p1: 'January 12, 2026 at 12:00AM ET',
              p2: 'January 27, 2026 at 12:00AM ET',
              p3: 'February 20, 2026 at 12:00AM ET',
              p4: 'February 23, 2026 at 12:00AM ET',
              p5: 'February 26, 2026 at 12:00AM ET',
              p6: 'February 28, 2026 at 12:00AM ET',
              p7: 'March 3, 2026 at 12:00AM ET',
              p8: 'March 10, 2026 at 12:00AM ET',
              p9: 'March 17, 2026 at 12:00AM ET',
            },
          },
        ],
      },
      [
        // Add facility 442 as non-transitioning facility
        {
          facilityId: '442',
          isCerner: false,
        },
      ],
    );

    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      mockUserWithMigrationInfo,
      mockFacilities,
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
      customRecipients,
    ).as('allRecipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is displayed
    cy.findByTestId('cerner-facilities-transition-alert-error-phase').should(
      'exist',
    );

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verifies Cerner facility alert is NOT present outside transition window (phase p1)', () => {
    const mockUserWithMigrationInfo = createUserWithMigrationInfo(
      mockUser,
      {
        userAtPretransitionedOhFacility: false,
        userFacilityMigratingToOh: true,
        userFacilityReadyForInfoAlert: false,
        migrationSchedules: [
          {
            facilities: [
              {
                facilityId: '979',
                facilityName: 'Test 1',
              },
            ],
            phases: {
              current: 'p1', // Before T-6 window
              p0: 'December 28, 2025 at 12:00AM ET',
              p1: 'January 12, 2026 at 12:00AM ET',
              p2: 'January 27, 2026 at 12:00AM ET',
              p3: 'February 20, 2026 at 12:00AM ET',
              p4: 'February 23, 2026 at 12:00AM ET',
              p5: 'February 26, 2026 at 12:00AM ET',
              p6: 'February 28, 2026 at 12:00AM ET',
              p7: 'March 3, 2026 at 12:00AM ET',
              p8: 'March 10, 2026 at 12:00AM ET',
              p9: 'March 17, 2026 at 12:00AM ET',
            },
          },
        ],
      },
      [
        // Add facility 442 as non-transitioning facility
        {
          facilityId: '442',
          isCerner: false,
        },
      ],
    );

    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      mockUserWithMigrationInfo,
      mockFacilities,
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
      customRecipients,
    ).as('allRecipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is NOT displayed (phase p1 is before T-6)
    cy.findByTestId('cerner-facilities-transition-alert-error-phase').should(
      'not.exist',
    );

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verifies Cerner facility alert is NOT present after transition window (phase p6)', () => {
    const mockUserWithMigrationInfo = createUserWithMigrationInfo(
      mockUser,
      {
        userAtPretransitionedOhFacility: false,
        userFacilityMigratingToOh: true,
        userFacilityReadyForInfoAlert: false,
        migrationSchedules: [
          {
            facilities: [
              {
                facilityId: '979',
                facilityName: 'Test 1',
              },
            ],
            phases: {
              current: 'p6', // After T+2 window
              p0: 'December 28, 2025 at 12:00AM ET',
              p1: 'January 12, 2026 at 12:00AM ET',
              p2: 'January 27, 2026 at 12:00AM ET',
              p3: 'February 20, 2026 at 12:00AM ET',
              p4: 'February 23, 2026 at 12:00AM ET',
              p5: 'February 26, 2026 at 12:00AM ET',
              p6: 'February 28, 2026 at 12:00AM ET',
              p7: 'March 3, 2026 at 12:00AM ET',
              p8: 'March 10, 2026 at 12:00AM ET',
              p9: 'March 17, 2026 at 12:00AM ET',
            },
          },
        ],
      },
      [
        // Add facility 442 as non-transitioning facility
        {
          facilityId: '442',
          isCerner: false,
        },
      ],
    );

    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      mockUserWithMigrationInfo,
      mockFacilities,
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
      customRecipients,
    ).as('allRecipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is NOT displayed (phase p6 is after transition window)
    cy.findByTestId('cerner-facilities-transition-alert-error-phase').should(
      'not.exist',
    );

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
