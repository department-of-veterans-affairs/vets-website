import { Locators } from '../utils/constants';

class PatientInterstitialPage {
  getCrisisLineLink = () => {
    return cy.get(`[text="Connect with the Veterans Crisis Line"]`);
  };

  getCrisisLineModal = () => {
    return cy
      .get('va-crisis-line-modal')
      .first()
      .shadow()
      .find('va-modal');
  };

  getCrisisLineModalLink = () => {
    return cy.get(`.va-crisis-panel-list`).find(`li`);
  };

  getContinueButton = () => {
    return cy.findByTestId(Locators.BUTTONS.CONTINUE);
  };

  getStartMessageLink = () => {
    return cy.findByTestId(Locators.LINKS.START_NEW_MESSAGE);
  };

  // Note: continueToRecentRecipients has been removed
  // Set up the intercept in your test BEFORE navigating to the interstitial page
  // Example:
  //   cy.intercept('POST', Paths.INTERCEPT.SENT_SEARCH, mockData).as('recentRecipients');
  //   PatientInboxPage.clickCreateNewMessage();
  //   cy.wait('@recentRecipients');
  //   PatientInterstitialPage.getStartMessageLink().click();

  CheckFocusOnVcl = () => {
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    cy.get('.va-modal-close').click();
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');
  };
}
export default new PatientInterstitialPage();
