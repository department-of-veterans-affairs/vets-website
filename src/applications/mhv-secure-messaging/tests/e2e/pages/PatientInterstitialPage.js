import { Locators } from '../utils/constants';

class PatientInterstitialPage {
  getCrisisLineLink = () => {
    return cy.get(`[text="Connect with the Veterans Crisis Line"]`);
  };

  getCrisisLineModal = () => {
    return cy.get(`#modal-crisisline`);
  };

  getCrisisLineModalLink = () => {
    return cy.get(`.va-crisis-panel-list`).find(`li`);
  };

  getContinueButton = () => {
    // return cy.get(Locators.BUTTONS.CONTINUE);
    // Prefer cy.find* selectors over cy.get() or cy.contains()
    // https://depo-platform-documentation.scrollhelp.site/developer-docs/best-practices-for-using-cypress#BestpracticesforusingCypress-Cypresstestinglibraryselectors
    // https://github.com/department-of-veterans-affairs/vets-website/actions/runs/13591277096/job/37998491182?pr=34960#step:15:604
    return cy.findByRole('button', { name: /^Continue/ });
  };

  CheckFocusOnVcl = () => {
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    cy.get('.va-modal-close').click();
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');
  };
}
export default new PatientInterstitialPage();
