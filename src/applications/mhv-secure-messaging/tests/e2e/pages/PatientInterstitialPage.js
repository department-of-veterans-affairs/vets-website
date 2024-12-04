import { Locators } from '../utils/constants';

class PatientInterstitialPage {
  get crisisLineLink() {
    return cy.get(`[text="Connect with the Veterans Crisis Line"]`);
  }

  get crisisLineModal() {
    return cy.get(`#modal-crisisline`);
  }

  get crisisLineModalLink() {
    return cy.get(`.va-crisis-panel-list`).find(`li`);
  }

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
