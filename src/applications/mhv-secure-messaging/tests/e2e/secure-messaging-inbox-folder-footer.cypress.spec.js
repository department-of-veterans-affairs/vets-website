import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import { smFooter } from '../../util/constants';

describe('Secure Messaging Inbox Message Sort', () => {
  it('Verify folder header', () => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      [
        {
          name: 'mhv_secure_messaging_remove_landing_page',
          value: true,
        },
      ],
    );

    SecureMessagingSite.login(updatedFeatureTogglesResponse);
    PatientInboxPage.loadInboxMessages();

    cy.get(Locators.INBOX_FOOTER).should(`be.visible`);
    cy.contains(smFooter.NEED_HELP).should(`be.visible`);
    cy.contains(smFooter.HAVE_QUESTIONS).should(`be.visible`);
    cy.contains(smFooter.CONTACT_FACILITY).should(`be.visible`);
    cy.contains(smFooter.LEARN_MORE)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.HEALTH_CARE_SECURE_MSG);
    cy.contains(smFooter.FIND_FACILITY)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.FIND_LOCATION);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
