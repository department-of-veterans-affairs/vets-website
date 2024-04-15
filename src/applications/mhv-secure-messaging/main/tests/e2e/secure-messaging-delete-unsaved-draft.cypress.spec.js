import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Assertions } from './utils/constants';

describe('Secure Messaging Delete Unsaved Compose Draft', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('verify delete could be canceled', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ force: true });
    cy.get(Locators.BUTTONS.DELETE_CANCEL).click({ force: true });
    cy.get('h1').should('have.text', Data.START_NEW_MSG);
    cy.get(Locators.BUTTONS.DELETE_DRAFT).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify confirm delete', () => {
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    composePage.selectCategory();
    composePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ force: true });
    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click({ force: true });
    cy.get('h1').should('have.text', Assertions.INBOX);
    cy.get(Locators.ALERTS.CONFIRM).should(
      'contain.text',
      'Draft was successfully deleted.',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
