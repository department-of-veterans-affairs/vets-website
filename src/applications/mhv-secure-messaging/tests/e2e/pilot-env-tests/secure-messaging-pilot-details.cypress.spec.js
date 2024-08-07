import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockSingleThread from '../fixtures/pilot-responses/single-message-thread-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('Secure Messaging Pilot feature flag', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  const pilotFeatureFlag = {
    name: 'mhv_secure_messaging_cerner_pilot',
    value: true,
  };
  const mockPilotFeatureToggles = {
    ...mockFeatureToggles,
    data: {
      ...mockFeatureToggles.data,
      features: [...mockFeatureToggles.data.features, pilotFeatureFlag],
    },
  };

  it('pilot ON inbox page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    PilotEnvPage.loadInboxMessages();
    PilotEnvPage.loadSingleThread();

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);

    // verify message header
    cy.get(Locators.HEADER).should(
      'contain.text',
      mockSingleThread.data[0].attributes.subject,
    );

    // verify message details
    cy.get(`[data-testid="message-date"]`).should(`contain`, currentDate);
    cy.get(`[data-testid="from"]`).should(
      `contain`,
      mockSingleThread.data[0].attributes.senderName,
    );
    cy.get(`[data-testid="to"]`).should(
      `contain`,
      mockSingleThread.data[0].attributes.recipientName,
    );
    cy.get(`[data-testid="message-id"]`).should(
      `contain`,
      mockSingleThread.data[0].attributes.messageId,
    );

    // verify buttons
    cy.get(`[data-testid="reply-button-body"]`)
      .should('be.visible')
      .and(`contain`, `Reply`);
    cy.get(`#print-button`)
      .should('be.visible')
      .and(`contain`, `Print`);
    cy.get(`#move-button`)
      .should('be.visible')
      .and(`contain`, `Move`);
    cy.get(`#trash-button`)
      .should('be.visible')
      .and(`contain`, `Trash`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
