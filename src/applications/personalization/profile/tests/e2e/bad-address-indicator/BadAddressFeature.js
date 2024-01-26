import { PROFILE_PATHS } from '@@profile/constants';
import { DEFAULT_ERROR_MESSAGE } from 'platform/user/profile/vap-svc/constants';

class BadAddressFeature {
  PROFILE_ALERT_TEST_ID = 'bad-address-profile-alert';

  FORM_ALERT_TEST_ID = 'bad-address-form-alert';

  EDIT_MAILING_ADDRESS_BUTTON_ID = '#edit-mailing-address';

  visitHubPage = () => {
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
  };

  visitContactInformationPage = () => {
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  };

  confirmPersonalInformationAlertIsShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('exist');
    cy.get('[data-testid="bad-address-profile-alert"] > :nth-child(3) > a')
      .should('have.attr', 'href')
      .and('include', PROFILE_PATHS.CONTACT_INFORMATION);
  };

  confirmPersonalInformationAlertIsNotShowing = () => {
    cy.findByTestId(this.PROFILE_ALERT_TEST_ID).should('not.exist');
  };

  confirmAlertInFormExists = () => {
    cy.findByTestId(this.FORM_ALERT_TEST_ID).should('exist');
  };

  confirmAlertInFormDoesNotExist = () => {
    cy.findByTestId(this.FORM_ALERT_TEST_ID).should('not.exist');
  };

  confirmErrorMessageInFormExists = () => {
    cy.findByText(DEFAULT_ERROR_MESSAGE).should('exist');
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
