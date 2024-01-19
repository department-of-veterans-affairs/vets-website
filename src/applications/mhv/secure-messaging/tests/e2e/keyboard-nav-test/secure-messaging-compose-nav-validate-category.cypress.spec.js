import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Validate the category', () => {
  it('selects a category', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    PatientInterstitialPage.getContinueButton().click();
    cy.tabToElement('[data-testid="edit-preferences-button"]').should(
      'have.focus',
    );
    cy.realPress(['Tab']);
    cy.realPress(['Tab']);

    cy.get('#OTHEROTHERinput').should('have.focus');
    cy.realPress(['Tab']);

    cy.get('#COVIDCOVIDinput').should('have.focus');
    cy.realPress(['Tab']);

    cy.get('#APPOINTMENTSAPPOINTMENTSinput').should('have.focus');
    cy.realPress(['Tab']);

    cy.get('#MEDICATIONSMEDICATIONSinput').should('have.focus');
    cy.realPress(['Tab']);

    cy.get('#TEST_RESULTSTEST_RESULTSinput').should('have.focus');
    cy.realPress(['Tab']);

    cy.get('#EDUCATIONEDUCATIONinput').should('have.focus');
    cy.tabToElement('[data-testid="message-subject-field"]').should(
      'have.focus',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
