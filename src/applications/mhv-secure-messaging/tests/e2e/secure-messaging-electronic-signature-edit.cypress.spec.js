import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('EDIT SIGNATURE FEATURE', () => {
  it('verify "Edit signature" link', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    cy.get(`[data-testid="edit-signature-link"]`)
      .should(`be.visible`)
      .and(`have.attr`, 'text', Data.EDIT_SIGNATURE)
      .and(`have.attr`, `href`, Data.LINKS.PROFILE_SIGNATURE);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify "Edit signature" link', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    cy.get(Locators.BUTTONS.PREFERENCES).should(`not.exist`);
    cy.get(Locators.LINKS.EDIT_SIGNATURE)
      .find('va-link')
      .should(`be.visible`)
      .and('have.attr', 'text', Data.EDIT_SIGNATURE);

    cy.get(Locators.LINKS.EDIT_SIGNATURE)
      .find('va-link')
      .should('have.attr', `href`, Data.LINKS.PROFILE_SIGNATURE);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
