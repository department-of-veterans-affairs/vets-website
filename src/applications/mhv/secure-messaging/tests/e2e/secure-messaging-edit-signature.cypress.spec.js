import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Constants } from './utils/constants';

describe('verify deeplinking sending the draft', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    landingPage.composeMessage();
  });

  it('verify modal appears and has a link', () => {
    cy.get('[data-testid="edit-preferences-button"]').click();

    cy.get('.va-modal-alert-body')
      .find(Constants.HEADER)
      .should('have.text', 'Edit your message preferences');
    cy.get('[data-testid="edit-preferences-link"]')
      .should('have.attr', 'href')
      .and('contain', 'mhv-portal-web/preferences');
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
