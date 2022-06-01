import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';

class BadAddressFeature {
  visitPersonalInformationPage = () => {
    cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION);
  };

  visitContactInformationPage = () => {
    cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
  };

  PROFILE_ALERT_TEST_ID = 'bad-address-profile-alert';

  confirmPersonalInformationAlertIsShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('exist');
    cy.get('[data-testid="bad-address-profile-alert"] > :nth-child(3) > a')
      .should('have.attr', 'href')
      .and('include', PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
  };

  confirmPersonalInformationAlertIsNotShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('not.exist');
  };

  CONTACT_INFORMATION_TEST_ID = 'bad-address-contact-alert';

  confirmContactInformationAlertIsShowing = () => {
    cy.findByTestId(this.CONTACT_INFORMATION_TEST_ID).should('exist');
  };

  confirmContactInformationAlertIsNotShowing = () => {
    cy.findByTestId(this.CONTACT_INFORMATION_TEST_ID).should('not.exist');
  };

  FORM_ALERT_TEST_ID = 'bad-address-form-alert';

  confirmAlertInFormExists = () => {
    cy.findByTestId(this.FORM_ALERT_TEST_ID).should('exist');
  };

  confirmAlertInFormDoesNotExist = () => {
    cy.findByTestId(this.FORM_ALERT_TEST_ID).should('not.exist');
  };

  confirmErrorMessageInFormExists = () => {
    cy.findByText(
      `We’re sorry. We can’t update your information right now. We’re working to fix this problem. Please check back later.`,
    ).should('exist');
  };

  startEditingAddress = () => {
    cy.get('#edit-mailing-address')
      .should('exist')
      .click({ waitForAnimations: true });
  };

  attemptToSubmitAddress = () => {
    cy.get('[data-testid="save-edit-button"]')
      .should('exist')
      .click({ waitForAnimations: true });
  };

  cancelAddressUpdate = () => {
    cy.get('[data-testid="cancel-edit-button"]')
      .should('exist')
      .click({ waitForAnimations: true });
  };

  confirmAddressEntered = () => {
    cy.get('[data-testid="confirm-address-button"]')
      .should('exist')
      .click({ waitForAnimations: true });
  };

  confirmUpdatedMessageIsShown = () => {
    cy.get('[data-testid="update-success-alert"]').should('exist');
  };
  // TODO: Add checks for accessibility and analytics?
}

export default new BadAddressFeature();
