import { Locators } from '../utils/constants';

class PatientInterstitialPage {
  getContinueButton = () => {
    return cy.get(Locators.BUTTONS.CONTINUE);
  };

  CheckFocusOnVcl = () => {
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    cy.get('.va-modal-close').click();
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');
  };
}
export default new PatientInterstitialPage();
