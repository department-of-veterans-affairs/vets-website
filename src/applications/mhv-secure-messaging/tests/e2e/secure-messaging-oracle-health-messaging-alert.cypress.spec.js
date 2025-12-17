import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/threads-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import mockToggles from './fixtures/toggles-response.json';
import mockCernerFacilities from './fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockNoCernerFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';
import mockUser from './fixtures/userResponse/user.json';
import mockSentFolderMetaResponse from './fixtures/sentResponse/folder-sent-metadata.json';
import mockDraftsFolderMetaResponse from './fixtures/draftsResponse/folder-drafts-metadata.json';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging - Oracle Health Messaging Alert', () => {
  const folderIds = [
    { id: '0', name: 'Inbox', path: Paths.INBOX },
    { id: '-1', name: 'Sent', path: Paths.SENT },
    { id: '-2', name: 'Drafts', path: Paths.DRAFTS },
  ];

  const testScenarios = [
    {
      name: 'both flags disabled',
      toggles: {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: false,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: false,
            },
          ],
        },
      },
      expectOracleHealthAlert: false,
      expectCernerFacilityAlert: true, // Cerner alert shows in Inbox if there are Cerner facilities (regardless of flags)
    },
    {
      name: 'only cernerPilotSmFeatureFlag enabled',
      toggles: {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: true,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: false,
            },
          ],
        },
      },
      expectOracleHealthAlert: false,
      expectCernerFacilityAlert: true, // Cerner alert shows in Inbox if there are Cerner facilities (regardless of flags)
    },
    {
      name: 'only maintenanceBannerFlag enabled',
      toggles: {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: false,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: true,
            },
          ],
        },
      },
      expectOracleHealthAlert: false,
      expectCernerFacilityAlert: true, // Cerner alert shows in Inbox if there are Cerner facilities (regardless of flags)
    },
    {
      name: 'both flags enabled',
      toggles: {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: true,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: true,
            },
          ],
        },
      },
      expectOracleHealthAlert: true,
      expectCernerFacilityAlert: false,
    },
  ];

  // Create a user with a Cerner facility (vha_687) that matches vamc-ehr.json
  const mockUserWithCernerFacility = {
    ...mockUser,
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        vaProfile: {
          ...mockUser.data.attributes.vaProfile,
          facilities: [
            ...(mockUser.data.attributes.vaProfile?.facilities || []),
            { facilityId: '687', isCerner: true },
          ],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    },
  };

  // Test with Cerner facilities in user profile
  describe('User with Cerner facilities', () => {
    testScenarios.forEach(scenario => {
      folderIds.forEach(folder => {
        it(`${scenario.name} - ${folder.name} folder`, () => {
          SecureMessagingSite.login(
            scenario.toggles,
            mockVamcEhr,
            true,
            mockUserWithCernerFacility,
            mockCernerFacilities,
          );

          PatientInboxPage.loadInboxMessages(
            mockMessages,
            mockSingleMessage,
            mockRecipients,
          );

          if (folder.id === '-1') {
            // Set up intercepts for Sent folder
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-1*`,
              mockSentFolderMetaResponse,
            ).as('sentFolder');
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-1/threads**`,
              mockMessages,
            ).as('sentFolderMessages');
          } else if (folder.id === '-2') {
            // Set up intercepts for Drafts folder
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-2*`,
              mockDraftsFolderMetaResponse,
            ).as('draftsFolder');
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-2/threads**`,
              mockMessages,
            ).as('draftsFolderMessages');
          }

          cy.visit(`${Paths.UI_MAIN}${folder.path}`);

          // Wait for the correct folder messages to load
          if (folder.id === '-1') {
            cy.wait('@sentFolderMessages');
          } else if (folder.id === '-2') {
            cy.wait('@draftsFolderMessages');
          } else {
            cy.wait('@inboxMessages');
          }

          if (scenario.expectOracleHealthAlert) {
            // Oracle Health Messaging Issues Alert should be visible
            cy.get('va-alert[status="warning"]', { timeout: 10000 })
              .should('be.visible')
              .within(() => {
                cy.get('h2[slot="headline"]')
                  .should('contain.text', 'We')
                  .and('contain.text', 'working on messages right now');
                cy.contains('Some of your messages might not be here').should(
                  'be.visible',
                );
                cy.contains(
                  'To review all your messages, go to My VA Health',
                ).should('be.visible');
                cy.get('va-link')
                  .should('be.visible')
                  .and('have.attr', 'text', 'Go to My VA Health');
              });

            // Cerner Facility Alert should NOT be visible when Oracle Health Alert is shown
            cy.get('[data-testid="cerner-facilities-alert"]').should(
              'not.exist',
            );
          } else if (scenario.expectCernerFacilityAlert && folder.id === '0') {
            // Cerner Facility Alert should be visible only in Inbox
            cy.get('[data-testid="cerner-facilities-alert"]').should(
              'be.visible',
            );

            // Oracle Health Messaging Issues Alert should NOT be visible
            cy.contains(`We're working on messages right now`).should(
              'not.exist',
            );
          } else {
            // No alerts should be visible
            cy.contains(`We're working on messages right now`).should(
              'not.exist',
            );
            // Only check for Cerner alert absence if we're not expecting it
            if (folder.id === '0') {
              cy.get('[data-testid="cerner-facilities-alert"]').should(
                'not.exist',
              );
            }
          }

          // Run accessibility check
          cy.injectAxe();
          cy.axeCheck(AXE_CONTEXT);
        });
      });
    });
  });

  // Test with NO Cerner facilities in user profile
  describe('User without Cerner facilities', () => {
    testScenarios.forEach(scenario => {
      folderIds.forEach(folder => {
        it(`${scenario.name} - ${folder.name} folder`, () => {
          SecureMessagingSite.login(
            scenario.toggles,
            mockVamcEhr,
            true,
            mockUser,
            mockNoCernerFacilities,
          );

          PatientInboxPage.loadInboxMessages(
            mockMessages,
            mockSingleMessage,
            mockRecipients,
          );

          if (folder.id === '-1') {
            // Set up intercepts for Sent folder
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-1*`,
              mockSentFolderMetaResponse,
            ).as('sentFolder');
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-1/threads**`,
              mockMessages,
            ).as('sentFolderMessages');
          } else if (folder.id === '-2') {
            // Set up intercepts for Drafts folder
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-2*`,
              mockDraftsFolderMetaResponse,
            ).as('draftsFolder');
            cy.intercept(
              'GET',
              `${Paths.SM_API_BASE}/folders/-2/threads**`,
              mockMessages,
            ).as('draftsFolderMessages');
          }

          cy.visit(`${Paths.UI_MAIN}${folder.path}`);

          // Wait for the correct folder messages to load
          if (folder.id === '-1') {
            cy.wait('@sentFolderMessages');
          } else if (folder.id === '-2') {
            cy.wait('@draftsFolderMessages');
          } else {
            cy.wait('@inboxMessages');
          }

          if (scenario.expectOracleHealthAlert) {
            // Oracle Health Messaging Issues Alert should be visible
            cy.get('va-alert[status="warning"]', { timeout: 10000 })
              .should('be.visible')
              .within(() => {
                cy.get('h2[slot="headline"]')
                  .should('contain.text', 'We')
                  .and('contain.text', 'working on messages right now');
                cy.contains('Some of your messages might not be here').should(
                  'be.visible',
                );
                cy.contains(
                  'To review all your messages, go to My VA Health',
                ).should('be.visible');
                cy.get('va-link')
                  .should('be.visible')
                  .and('have.attr', 'text', 'Go to My VA Health');
              });
          } else {
            // No Oracle Health alert should be visible
            cy.get('h2')
              .contains('working on messages right now')
              .should('not.exist');
          }

          // Cerner Facility Alert should never be visible without Cerner facilities
          cy.get('[data-testid="cerner-facilities-alert"]').should('not.exist');

          // Run accessibility check
          cy.injectAxe();
          cy.axeCheck(AXE_CONTEXT);
        });
      });
    });
  });

  // Additional edge case: Verify alert precedence
  describe('Alert precedence', () => {
    it('Oracle Health Issues Alert takes precedence over Cerner Facility Alert when both flags are enabled', () => {
      const bothFlagsEnabled = {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: true,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: true,
            },
          ],
        },
      };

      SecureMessagingSite.login(
        bothFlagsEnabled,
        mockVamcEhr,
        true,
        mockUserWithCernerFacility,
        mockCernerFacilities,
      );

      PatientInboxPage.loadInboxMessages(
        mockMessages,
        mockSingleMessage,
        mockRecipients,
      );

      cy.visit(`${Paths.UI_MAIN}${Paths.INBOX}`);
      cy.wait('@inboxMessages');

      // Oracle Health Messaging Issues Alert should be visible
      cy.get('h2[slot="headline"]', { timeout: 10000 })
        .should('contain.text', 'We')
        .and('contain.text', 'working on messages right now');

      // Cerner Facility Alert should NOT be visible
      cy.get('[data-testid="cerner-facilities-alert"]').should('not.exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  // Test link functionality
  describe('Alert link functionality', () => {
    it('Oracle Health alert link has correct attributes', () => {
      const bothFlagsEnabled = {
        ...mockToggles,
        data: {
          ...mockToggles.data,
          features: [
            ...mockToggles.data.features,
            {
              name: 'mhv_secure_messaging_cerner_pilot',
              value: true,
            },
            {
              name:
                'mhv_secure_messaging_cerner_pilot_system_maintenance_banner',
              value: true,
            },
          ],
        },
      };

      SecureMessagingSite.login(
        bothFlagsEnabled,
        mockVamcEhr,
        true,
        mockUser,
        mockCernerFacilities,
      );

      PatientInboxPage.loadInboxMessages(
        mockMessages,
        mockSingleMessage,
        mockRecipients,
      );

      cy.visit(`${Paths.UI_MAIN}${Paths.INBOX}`);

      // Verify link attributes
      cy.get('va-alert[status="warning"]')
        .find('va-link')
        .should('have.attr', 'text', 'Go to My VA Health')
        .and('have.attr', 'rel', 'noopener noreferrer')
        .and('have.attr', 'href')
        .and('include', '/pages/messaging/inbox');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
