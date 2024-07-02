import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('verify deeplinking sending the draft', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientInboxPage.composeMessage();
  });

  it('verify modal appears and has a link', () => {
    cy.get(Locators.BUTTONS.PREFERENCES).click();

    cy.get('.va-modal-alert-body')
      .find(Locators.HEADER2)
      .should('have.text', Data.EDIT_YOUR_MSG_PREFRENCES);
    cy.get(Locators.LINKS.PREFER_LINK)
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
