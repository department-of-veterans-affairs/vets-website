import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from '../utils/constants';

describe('SM KEYBOARD NAVIGATION TO COMPOSE', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('validate user can navigate to compose page', () => {
    cy.tabToElement(Locators.LINKS.CREATE_NEW_MESSAGE);
    cy.realPress(['Enter']);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    cy.findByTestId(Locators.INTERSTITIAL_CONTINUE_BUTTON).should('be.visible');
    cy.tabToElement(`[data-testid=${Locators.INTERSTITIAL_CONTINUE_BUTTON}]`);
    cy.realPress(['Enter']);
    cy.get(Locators.ALERTS.PAGE_TITLE)
      .should('be.focused')
      .and('have.text', Data.START_NEW_MSG);

    PatientComposePage.backToInbox();
  });
});
