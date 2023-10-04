import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  it.skip('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();
    inboxPage.navigateToComposePage();
    composePage.composeDraftByKeyboard();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.saveDraftByKeyboard();
    // next line is for checking if assertion works properly
    /*
    cy.get('#save-draft-button')
      .should('exist')
      .and('be.focused');
    cy.get('.last-save-time').should('be.focused');
    */
  });
});
