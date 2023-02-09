import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging validate select dropdown Form Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('validate select dropdown', () => {
    cy.get('#select-search-folder-dropdown')
      .shadow()
      .find('select')
      .select('Inbox')
      .should('contain');
    cy.injectAxe();
    cy.axeCheck();
    cy.as('[#=select-search-folder-dropdown"validate select dropdown"]').should(
      'exist',
    );
    cy.intercept;
  });
});
