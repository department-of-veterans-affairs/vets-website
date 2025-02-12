import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators, Paths } from './utils/constants';

describe('Secure Messaging Inbox Message Sort', () => {
  it('Verify folder header', () => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      'mhv_secure_messaging_remove_landing_page',
      true,
    );
    SecureMessagingSite.login(updatedFeatureTogglesResponse);
    PatientInboxPage.loadInboxMessages();

    cy.get(Locators.INBOX_FOOTER).should(`be.visible`);
    cy.contains(Data.INBOX_FOOTER.HEADER).should(`be.visible`);
    cy.contains(Data.INBOX_FOOTER.PARAGRAPH_1).should(`be.visible`);
    cy.contains(Data.INBOX_FOOTER.PARAGRAPH_2).should(`be.visible`);
    cy.contains(Data.INBOX_FOOTER.LINK_1)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.HEALTH_CARE_SECURE_MSG);
    cy.contains(Data.INBOX_FOOTER.LINK_2)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.FIND_LOCATION);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
