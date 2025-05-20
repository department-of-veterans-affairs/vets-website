import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user';
import transactionCompletedWithNoChanges from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';
import transactionCompletedWithError from '@@profile/tests/fixtures/transactions/error-transaction.json';
import { mockFeatureToggles } from '../helpers';

const setup = (mobile = false) => {
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  cy.login(mockUser);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  cy.injectAxe();
};

describe('Modals on the contact information and content page after editing', () => {
  it('should allow the ability to reopen the edit modal when the transaction completes', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // find edit button and click it
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // verify input exists
    cy.get('va-text-input[label="Email address" i]');

    cy.axeCheck();
  });
});

describe('when moving to other profile pages', () => {
  it('should exit edit mode if opened', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    cy.findByRole('link', {
      name: /military information/i,
    }).click({
      force: true,
    });
    cy.findByRole('link', {
      name: /contact.*information/i,
    }).click({
      force: true,
    });
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).should('exist');

    cy.axeCheck();
  });
});

describe('when editing other profile fields on the same page', () => {
  it('should exit edit mode if no changes have been made', () => {
    setup();

    // Open edit view for email address
    cy.findByRole('button', {
      name: new RegExp(`edit contact email address`, 'i'),
    }).click({
      force: true,
    });

    // Open another field in edit view
    cy.findByRole('button', {
      name: new RegExp(`edit mobile phone number`, 'i'),
    }).click({
      force: true,
    });

    cy.get('[name="root_inputPhoneNumber"]').should('exist');

    // Cancel edit should also exist the edit mode with no modal
    cy.findByText('Cancel').click({ force: true });

    // edit button should reappear once edit mode is exited
    cy.findByRole('button', {
      name: new RegExp(`edit mobile phone number`, 'i'),
    }).should('exist');

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page when they error', () => {
  it('should exist', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept('/v0/profile/email_addresses', transactionCompletedWithError);

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // expect an error to be shown
    cy.findByTestId('edit-error-alert').should('exist');

    cy.axeCheck();
  });
});
