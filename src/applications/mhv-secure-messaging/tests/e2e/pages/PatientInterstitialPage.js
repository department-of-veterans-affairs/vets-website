import { Locators, Paths } from '../utils/constants';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';

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
    // Prefer cy.find* selectors over cy.get() or cy.contains()
    // https://depo-platform-documentation.scrollhelp.site/developer-docs/best-practices-for-using-cypress#BestpracticesforusingCypress-Cypresstestinglibraryselectors
    // https://github.com/department-of-veterans-affairs/vets-website/actions/runs/13591277096/job/37998491182?pr=34960#step:15:604
    return cy.findByTestId(Locators.BUTTONS.CONTINUE);
  };

  getStartMessageLink = () => {
    return cy.findByTestId('start-message-link');
  };

  continueToRecentRecipients = (
    searchMockResponse = searchSentFolderResponse,
  ) => {
    cy.intercept(`POST`, Paths.INTERCEPT.SENT_SEARCH, searchMockResponse).as(
      'recentRecipients',
    );
    this.getStartMessageLink().click();
    cy.wait('@recentRecipients');
  };

  CheckFocusOnVcl = () => {
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    cy.get('.va-modal-close').click();
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');
  };
}
export default new PatientInterstitialPage();
