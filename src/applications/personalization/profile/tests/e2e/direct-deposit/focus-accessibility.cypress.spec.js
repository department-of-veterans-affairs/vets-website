import directDepositMocks from '@@profile/mocks/endpoints/direct-deposits';
import DirectDepositPage from './page-objects/DirectDeposit';

const directDeposit = new DirectDepositPage();

describe('Direct Deposit', () => {
  beforeEach(() => {
    directDeposit.setup();
  });

  it('should open the bank account information form and return to the original state on cancel', () => {
    const editButton = 'va-button[text="Edit"]';
    const cancelButton = 'va-button[text="Cancel"]';
    // Mock the API response for direct deposits eligibility
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isEligible,
    );
    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();

    // Verify initial prompt to add bank information is visible
    cy.contains('p', 'Edit your profile to add your bank information.').should(
      'be.visible',
    );
    cy.get(editButton)
      .should('exist')
      .should('not.be.focused');

    // Click the Edit button and ensure it is removed from the DOM
    cy.get(editButton).click();
    cy.get(editButton).should('not.exist');

    // Verify the bank account information form appears and is focused
    cy.contains(
      'p',
      'Provide your account type, routing number, and account number.',
    ).should('be.visible');
    cy.get('#bank-account-information').should('be.focused');

    // Click the Cancel button to close the form
    cy.get(cancelButton)
      .should('exist')
      .click();

    // Verify the page returns to the original state and Edit button is focused
    cy.findByRole('heading', { name: 'Direct deposit information' }).should(
      'exist',
    );
    cy.get(editButton).should('be.focused');
  });
});
