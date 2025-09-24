import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.login(mockUser);
  mockGETEndpoints([
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/full_name',
    'v0/profile/ch33_bank_accounts',
    'v0/profile/status',
    'v0/profile/direct_deposits',
    'v0/mhv_account',
  ]);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  cy.get('va-loading-indicator').should('exist');
  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');
};

describe('Contact info fields', () => {
  it('should manage focus correctly when going into edit mode', () => {
    setup();
    cy.injectAxe();

    cy.get('va-button[label="Edit Mailing address"]').click();
    cy.get('va-checkbox[name="root_view:livesOnMilitaryBase"]').should(
      'be.focused',
    );
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Mailing address"]')
      .shadow()
      .find('button')
      .should('be.focused');

    cy.get('va-button[label="Edit Home address"]').click();
    cy.findByLabelText(/use my mailing address for my home address/i).should(
      'be.focused',
    );
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Home address"]')
      .shadow()
      .find('button')
      .should('be.focused');

    cy.get('va-button[label="Edit Home phone number"]').click();

    cy.findByTestId('homePhone').should('exist');
    cy.get('va-text-input[name="root_inputPhoneNumber"]').should('be.focused');
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Home phone number"]')
      .shadow()
      .find('button')
      .should('be.focused');

    cy.get('va-button[label="Edit Work phone number"]').click();
    cy.findByTestId('workPhone').should('exist');
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Work phone number"]')
      .shadow()
      .find('button')
      .should('be.focused');

    cy.get('va-button[label="Edit Mobile phone number"]').click();
    cy.findByTestId('mobilePhone').should('exist');
    cy.get('va-text-input[name="root_inputPhoneNumber"]').should('be.focused');
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Mobile phone number"]')
      .shadow()
      .find('button')
      .should('be.focused');

    cy.get('va-button[label="Edit Contact email address"]').click();
    cy.findByTestId('email').should('exist');
    cy.get('va-text-input[name="root_emailAddress"]').should('be.focused');
    cy.axeCheck();
    cy.findByTestId('cancel-edit-button').click();
    cy.get('va-button[label="Edit Contact email address"]')
      .shadow()
      .find('button')
      .should('be.focused');
  });
});
