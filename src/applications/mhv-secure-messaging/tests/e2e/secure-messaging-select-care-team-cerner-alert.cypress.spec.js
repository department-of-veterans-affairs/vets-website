import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/threads-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockToggles from './fixtures/toggles-response.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';
import mockUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import { AXE_CONTEXT, Paths } from './utils/constants';

// Custom recipients mock with transitioning (979) and non-transitioning (442) facilities
const customRecipients = {
  data: [
    {
      id: '1',
      type: 'all_triage_teams',
      attributes: {
        triageTeamId: 1,
        name: 'Test Care Team 979',
        stationNumber: '979',
        blockedStatus: false,
        relationType: 'PATIENT',
        preferredTeam: true,
        ohTriageGroup: false,
        migratingToOh: true,
      },
    },
    {
      id: '2',
      type: 'all_triage_teams',
      attributes: {
        triageTeamId: 2,
        name: 'Test Care Team 442',
        stationNumber: '442',
        blockedStatus: false,
        relationType: 'PATIENT',
        preferredTeam: false,
        ohTriageGroup: false,
      },
    },
  ],
  meta: {
    associatedTriageGroups: 2,
    associatedBlockedTriageGroups: 0,
  },
};

// Helper function to create user with specific migration info
const createUserWithMigrationInfo = (ohMigrationInfo, facilities = null) => {
  // Get existing facilities from mock user
  const existingFacilities =
    mockUser.data.attributes.vaProfile?.facilities || [];

  // Ensure facility 979 exists and update it if needed
  let updatedFacilities = [...existingFacilities];
  const facility979Index = updatedFacilities.findIndex(
    f => f.facilityId === '979',
  );

  // For pretransitioned facilities, isCerner should be true
  // For migrating facilities, isCerner should be false
  const isCernerFacility =
    ohMigrationInfo.userAtPretransitionedOhFacility === true;

  if (facility979Index === -1) {
    // Add facility 979 if it doesn't exist
    updatedFacilities.push({
      facilityId: '979',
      isCerner: isCernerFacility,
    });
  } else {
    // Update existing facility 979
    updatedFacilities[facility979Index] = {
      ...updatedFacilities[facility979Index],
      facilityId: '979',
      isCerner: isCernerFacility,
    };
  }

  // Add any additional facilities if provided
  if (facilities) {
    updatedFacilities = [...updatedFacilities, ...facilities];
  }

  return {
    ...mockUser,
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        vaProfile: {
          ...mockUser.data.attributes.vaProfile,
          facilities: updatedFacilities,
          isCernerPatient: true,
          // Keep flags ONLY in ohMigrationInfo - reducer will map them to root level
          ohMigrationInfo: {
            userAtPretransitionedOhFacility:
              ohMigrationInfo.userAtPretransitionedOhFacility,
            userFacilityMigratingToOh:
              ohMigrationInfo.userFacilityMigratingToOh,
            userFacilityReadyForInfoAlert:
              ohMigrationInfo.userFacilityReadyForInfoAlert,
            migrationSchedules: ohMigrationInfo.migrationSchedules,
          },
        },
      },
    },
  };
};

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

    // Click the Start a new message link
    cy.contains('a', 'Start a new message').click({ force: true });

    // Click the Continue to start message link
    cy.contains('a', 'Continue to start message').click({ force: true });

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

    // Click the Start a new message link
    cy.contains('a', 'Start a new message').click({ force: true });

    // Click the Continue to start message link
    cy.contains('a', 'Continue to start message').click({ force: true });

    // Verify the Cerner facility alert is NOT displayed (phase p1 is before T-6)
    cy.get('va-alert[status="error"]').should('not.exist');

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verifies Cerner facility alert is NOT present after transition window (phase p6)', () => {
    const mockUserWithMigrationInfo = createUserWithMigrationInfo(
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

    // Click the Start a new message link
    cy.contains('a', 'Start a new message').click({ force: true });

    // Click the Continue to start message link
    cy.contains('a', 'Continue to start message').click({ force: true });

    // Verify the Cerner facility alert is NOT displayed (phase p6 is after transition window)
    cy.get('va-alert[status="error"]').should('not.exist');

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
