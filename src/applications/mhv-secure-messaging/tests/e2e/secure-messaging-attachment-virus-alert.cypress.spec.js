import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Paths, Alerts } from './utils/constants';

describe('Verify attachment with virus alert', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
      waitforanimations: true,
    });
    PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
    cy.intercept('POST', Paths.SM_API_EXTENDED, {
      statusCode: 400,
      body: { errors: [{ code: 'SM172' }] },
    }).as('failed');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });
  });

  it('verify alert exist and attach button disappears', () => {
    cy.get(`[data-testid="attachment-virus-alert"]`)
      .should(`be.visible`)
      .and(`have.text`, Alerts.VIRUS_ATTCH);

    cy.get(Locators.ATTACH_FILE_INPUT).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify attach button back`, () => {
    cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).click({ force: true });
    cy.get(Locators.BUTTONS.CONFIRM_REMOVE_ATTACHMENT)
      .should(`be.visible`)
      .then(btn => {
        return new Cypress.Promise(resolve => {
          setTimeout(resolve, 2000);
          cy.wrap(btn).click();
        });
      });

    cy.get(Locators.ATTACH_FILE_INPUT).should(`exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
