import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';
import twoSuggestions from 'applications/personalization/profile/tests/fixtures/mailing-addresses/two-suggestions-2.js';

describe('Personal and contact information', () => {
  describe('when entering a home address that has two suggestions', () => {
    it('should successfully update on Desktop', () => {
      setUp('two-suggestions');

      cy.get('#root_addressLine1')
        .clear()
        .type('575 20th');
      cy.get('#root_addressLine2').clear();

      cy.get('#root_city')
        .clear()
        .type('San Francisco');
      cy.get('#root_stateCode').select('CA');
      cy.get('#root_zipCode')
        .clear()
        .type('12345');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please confirm your address').should('exist');

      // User entered address exists
      cy.findByText('575 20th').should('exist');
      cy.findByText(/San Francisco, CA 12345/i).should('exist');

      // First suggestion
      cy.findByText('575 20th Ave').should('exist');

      // Second suggestion
      cy.findByText('575 20th St').should('exist');

      // Confirm we choose the first option (default)
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText('575 20th').should('exist');
    });
  });
});
