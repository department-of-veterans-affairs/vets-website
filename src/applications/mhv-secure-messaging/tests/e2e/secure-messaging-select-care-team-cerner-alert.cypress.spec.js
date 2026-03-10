import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/threads-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockToggles from './fixtures/toggles-response.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';
import mockUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import { AXE_CONTEXT, Paths } from './utils/constants';
import { createMigratingUser, customRecipients } from './utils/user-helpers';

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
    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      createMigratingUser(mockUser, 'p4'),
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

  it('verifies Cerner facility error alert is NOT present before error phase window (phase p1)', () => {
    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      createMigratingUser(mockUser, 'p1'),
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

    // Verify the error alert is NOT displayed (p1 is before error phase window p3-p5)
    cy.findByTestId('cerner-facilities-transition-alert-error-phase').should(
      'not.exist',
    );

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verifies Cerner facility error alert is NOT present after error phase window (phase p6)', () => {
    SecureMessagingSite.login(
      customFeatureToggles,
      mockVamcEhr,
      true,
      createMigratingUser(mockUser, 'p6'),
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

    // Verify the error alert is NOT displayed (p6 is after error phase window p3-p5)
    cy.findByTestId('cerner-facilities-transition-alert-error-phase').should(
      'not.exist',
    );

    // Run accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
