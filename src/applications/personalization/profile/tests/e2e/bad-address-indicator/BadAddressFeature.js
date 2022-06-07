import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';

class BadAddressFeature {
  PROFILE_ALERT_TEST_ID = 'bad-address-profile-alert';

  FORM_ALERT_TEST_ID = 'bad-address-form-alert';

  CONTACT_INFORMATION_TEST_ID = 'bad-address-contact-alert';

  EDIT_MAILING_ADDRESS_BUTTON_ID = '#edit-mailing-address';

  visitPersonalInformationPage = () => {
    cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION);
  };

  visitContactInformationPage = () => {
    cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
  };

  confirmPersonalInformationAlertIsShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('exist');
    cy.get('[data-testid="bad-address-profile-alert"] > :nth-child(3) > a')
      .should('have.attr', 'href')
      .and('include', PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
  };

  confirmPersonalInformationAlertIsNotShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('not.exist');
  };

  confirmContactInformationAlertIsShowing = () => {
    cy.findByTestId(this.CONTACT_INFORMATION_TEST_ID).should('exist');
  };

  confirmContactInformationAlertIsNotShowing = () => {
    cy.findByTestId(this.CONTACT_INFORMATION_TEST_ID).should('not.exist');
  };

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
    cy.get(this.EDIT_MAILING_ADDRESS_BUTTON_ID)
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

  confirmContactPageHasAccessibilityConcerns = () => {
    cy.get('#described-by-mailingAddress').should(
      'have.attr',
      'id',
      'described-by-mailingAddress',
    );
    cy.get(this.EDIT_MAILING_ADDRESS_BUTTON_ID).should(
      'have.attr',
      'aria-describedby',
      'described-by-mailingAddress',
    );
  };
}

export default new BadAddressFeature();
