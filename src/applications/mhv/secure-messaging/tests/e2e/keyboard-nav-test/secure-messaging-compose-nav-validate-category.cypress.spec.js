import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';

describe('Validate the category', () => {
  it('selects a category', () => {
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    cy.tabToElement('.link-button').should('have.focus');
    cy.realPress(['Tab']);
    cy.realPress(['ArrowDown']);
    cy.get('#COVIDCOVID').should('have.focus');
    cy.realPress(['ArrowDown']);
    cy.get('#APPOINTMENTSAPPOINTMENTS').should('have.focus');
    cy.realPress(['ArrowDown']);
    cy.get('#MEDICATIONSMEDICATIONS').should('have.focus');
    cy.realPress(['ArrowDown']);
    cy.get('#TEST_RESULTSTEST_RESULTS').should('have.focus');
    cy.realPress(['ArrowDown']);
    cy.get('#EDUCATIONEDUCATION').should('have.focus');
    cy.tabToElement('[data-testid="message-subject-field"]').should(
      'have.focus',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
