import { Locators } from '../utils/constants';

class PatientInterstitialPage {
  getCrisisLineLink = () => {
    return cy.get(`[text="Connect with the Veterans Crisis Line"]`);
  };

  getCrisisLineModal = () => {
    // Try new component first, fall back to old selector
    return cy.get('body').then($body => {
      if ($body.find('va-crisis-line-modal').length > 0) {
        return cy
          .get('va-crisis-line-modal')
          .shadow()
          .find('va-modal');
      }
      return cy.get(`#modal-crisisline`);
    });
  };

  getCrisisLineModalLink = () => {
    // Try new component first, fall back to old selector
    return cy.get('body').then($body => {
      if ($body.find('va-crisis-line-modal').length > 0) {
        return cy
          .get('va-crisis-line-modal')
          .shadow()
          .find('va-modal')
          .shadow()
          .find(`.va-crisis-panel-list li`);
      }
      return cy.get(`.va-crisis-panel-list`).find(`li`);
    });
  };

  getCrisisLineCloseButton = () => {
    // Try new component first, fall back to old selector
    return cy.get('body').then($body => {
      if ($body.find('va-crisis-line-modal').length > 0) {
        return cy
          .get('va-crisis-line-modal')
          .shadow()
          .find('va-modal')
          .shadow()
          .find('.va-modal-close');
      }
      return cy.get('.va-modal-close');
    });
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
    this.getCrisisLineLink().click();
    this.getCrisisLineModal().should('exist');
    this.getCrisisLineCloseButton().click({ force: true });
    this.getCrisisLineLink().should('have.focus');
  };
}
export default new PatientInterstitialPage();
