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
              p0: '2025-12-28',
              p1: '2026-01-12',
              p2: '2026-01-27',
              p3: '2026-02-20',
              p4: '2026-02-23',
              p5: '2026-02-26',
              p6: '2026-02-28',
              p7: '2026-03-03',
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
    ).as('recipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is displayed - look for va-alert with error status
    cy.get('va-alert[status="error"]')
      .should('exist')
      .and('be.visible');

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
              p0: '2025-12-28',
              p1: '2026-01-12',
              p2: '2026-01-27',
              p3: '2026-02-20',
              p4: '2026-02-23',
              p5: '2026-02-26',
              p6: '2026-02-28',
              p7: '2026-03-03',
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
    ).as('recipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is NOT displayed (phase p1 is before T-6)
    cy.get('va-alert[status="error"]').should('not.exist');

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
              p0: '2025-12-28',
              p1: '2026-01-12',
              p2: '2026-01-27',
              p3: '2026-02-20',
              p4: '2026-02-23',
              p5: '2026-02-26',
              p6: '2026-02-28',
              p7: '2026-03-03',
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
    ).as('recipients');

    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      customRecipients,
    );

    PatientInboxPage.navigateToComposePageCuratedFlow();

    // Verify the Cerner facility alert is NOT displayed (phase p6 is after transition window)
    cy.get('va-alert[status="error"]').should('not.exist');

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
