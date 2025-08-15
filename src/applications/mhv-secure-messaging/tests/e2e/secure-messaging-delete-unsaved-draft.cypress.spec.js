import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Assertions } from './utils/constants';

describe('Secure Messaging Delete Unsaved Compose Draft', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();
  });

  it('verify delete could be canceled', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ force: true });
    cy.get(Locators.BUTTONS.DELETE_CANCEL).click({ force: true });
    cy.get('h1').should('have.text', Data.START_NEW_MSG);
    cy.get(Locators.BUTTONS.DELETE_DRAFT).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify confirm delete', () => {
    PatientComposePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ force: true });
    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click({ force: true });
    cy.get('h1').should('have.text', `Messages: ${Assertions.INBOX}`);
    cy.get(Locators.ALERTS.GEN_ALERT).should(
      'contain.text',
      'Draft was successfully deleted.',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
