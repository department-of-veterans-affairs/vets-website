import { mebUser } from '../fixtures/userResponse';
import { mockClaimStatus } from '../fixtures/mockClaimStatusEligible';

describe('All Field, texts and links should be validated on letters app', () => {
  it('All texts are present for the letters page authenticated with letter', () => {
    cy.intercept(
      'GET',
      '/meb_api/v0/claim_status?latest=true',
      mockClaimStatus,
    ).as('mockClaimStatus');
    cy.login(mebUser);

    cy.visit('/education/download-letters/letters');
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/download-letters/letters');
    cy.findByTestId('form-title').should(
      'have.text',
      'Your VA education letter',
    );

    cy.get('a[href*="/meb_api/v0/claim_letter"]').should('be.visible');
    cy.findByText(
      'How do I download and open my education decision letter?',
    ).should('be.visible');
  });
});
