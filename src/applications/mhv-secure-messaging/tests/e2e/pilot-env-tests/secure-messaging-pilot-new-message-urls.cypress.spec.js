import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import PilotEnvPage from '../pages/PilotEnvPage';

describe('Secure Messaging Pilot feature flag', () => {
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
    SecureMessagingSite.login(mockPilotFeatureToggles);

    PilotEnvPage.loadInboxMessages();

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);
    cy.get(`[data-testid="compose-message-link"]`).click();
    cy.get(`[data-testid="continue-button"]`).click();
    cy.url().should('include', `select-health-care-system`);
    cy.get('h1').should(
      'have.text',
      'Which VA health care system do you want to send a message to?',
    );
    cy.get(`va-radio-option`).should('have.length.at.least', 1);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
