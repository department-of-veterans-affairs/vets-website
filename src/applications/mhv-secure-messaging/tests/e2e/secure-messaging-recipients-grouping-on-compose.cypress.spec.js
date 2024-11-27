import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';

describe('SM RECIPIENTS GROUPING', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles(
    `mhv_secure_messaging_recipient_opt_groups`,
    true,
  );
  it('verify grouping on compose', () => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);

    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`optgroup`)
      .should(`have.length`, 4);

    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`optgroup`)
      .each(el => {
        cy.wrap(el)
          .find(`option`)
          .its(`length`)
          .should(`be.greaterThan`, 0);
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
