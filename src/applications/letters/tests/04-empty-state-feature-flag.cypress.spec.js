import Timeouts from 'platform/testing/e2e/timeouts';
import {
  benefitSummaryOptions,
  address,
  countries,
  states,
  mockUserData,
} from './e2e/fixtures/mocks/lh_letters';

describe('Letters Empty State Feature Flag', () => {
  const emptyLettersResponse = {
    fullName: 'William Shakespeare',
    letters: [], // Empty letters array to trigger empty state
  };

  beforeEach(() => {
    // Mock API responses
    cy.intercept(
      'GET',
      '/v0/letters_generator/beneficiary',
      benefitSummaryOptions,
    ).as('benefitSummaryOptions');
    cy.intercept('GET', '/v0/address', address).as('address');
    cy.intercept('GET', '/v0/address/countries', countries).as('countries');
    cy.intercept('GET', '/v0/address/states', states).as('states');

    cy.login(mockUserData);
  });

  context('when feature flag is enabled', () => {
    beforeEach(() => {
      // Enable the feature flag
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'empty_state_benefit_letters',
              value: true,
            },
          ],
        },
      }).as('featureToggles');

      // Mock empty letters response
      cy.intercept('GET', '/v0/letters_generator', emptyLettersResponse).as(
        'emptyLetters',
      );
    });

    it('should display empty state content when no letters are available', () => {
      cy.visit('/records/download-va-letters/letters/');

      // Wait for the page to load and API calls to complete
      cy.wait('@emptyLetters', { timeout: Timeouts.slow });
      cy.wait('@featureToggles');

      // Verify page loads correctly
      cy.get('body').should('be.visible');
      cy.title().should(
        'contain',
        'Your VA benefit letters and documents | Veterans Affairs',
      );

      // Verify the letters accordion is not present
      cy.get('[data-test-id="letters-accordion"]').should('not.exist');

      // Verify empty state content is displayed
      cy.get('h3')
        .contains("You don't have any benefit letters or documents available.")
        .should('be.visible');

      cy.get('p')
        .contains(
          'Most Veterans find benefit letters and documents here such as:',
        )
        .should('be.visible');

      // Verify the list of typical letters is shown
      cy.contains(
        'Most Veterans find benefit letters and documents here such as:',
      )
        .next('ul')
        .within(() => {
          cy.contains('Benefit Summary and Service Verification Letter').should(
            'be.visible',
          );
          cy.contains('Proof of Service Card').should('be.visible');
          cy.contains('Civil Service Preference Letter').should('be.visible');
        });

      // Verify contact information is displayed
      cy.get('p')
        .contains(
          "If you think you should have a benefit letter and document that's not here",
        )
        .should('be.visible');

      // Verify VA telephone components are present
      cy.get('va-telephone[contact="8008271000"]').should('be.visible');
      cy.get('va-telephone[contact="711"][tty]').should('be.visible');

      // Run accessibility check
      cy.injectAxeThenAxeCheck();
    });

    it('should not display empty state when letters are available', () => {
      // Override with letters available
      const lettersWithData = {
        fullName: 'William Shakespeare',
        letters: [
          { name: 'Commissary Letter', letterType: 'commissary' },
          { name: 'Proof of Service Letter', letterType: 'proof_of_service' },
        ],
      };

      cy.intercept('GET', '/v0/letters_generator', lettersWithData).as(
        'lettersWithData',
      );

      cy.visit('/records/download-va-letters/letters/');

      cy.wait('@lettersWithData', { timeout: Timeouts.slow });

      // Verify letters accordion is present
      cy.get('[data-test-id="letters-accordion"]', {
        timeout: Timeouts.slow,
      }).should('be.visible');

      // Verify empty state is not displayed
      cy.get('h3')
        .contains("You don't have any benefit letters or documents available.")
        .should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when feature flag is disabled', () => {
    beforeEach(() => {
      // Disable the empty state feature flag
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'empty_state_benefit_letters',
              value: false,
            },
          ],
        },
      }).as('featureTogglesDisabled');

      // Mock empty letters response
      cy.intercept('GET', '/v0/letters_generator', emptyLettersResponse).as(
        'emptyLetters',
      );
    });

    it('should not display empty state content', () => {
      cy.visit('/records/download-va-letters/letters/');

      cy.wait('@emptyLetters', { timeout: Timeouts.slow });
      cy.wait('@featureTogglesDisabled');

      // Verify page loads correctly
      cy.get('body').should('be.visible');
      cy.title().should(
        'contain',
        'Your VA benefit letters and documents | Veterans Affairs',
      );

      // Verify the letters accordion is not present
      cy.get('[data-test-id="letters-accordion"]').should('not.exist');

      // Verify empty state content is NOT displayed when flag is disabled
      cy.get('h3')
        .contains("You don't have any benefit letters or documents available.")
        .should('not.exist');

      cy.get('p')
        .contains(
          'Most Veterans find benefit letters and documents here such as:',
        )
        .should('not.exist');

      // The page should be relatively empty (just the header and address section)
      cy.get('h1')
        .contains('Your VA benefit letters and documents')
        .should('be.visible');

      cy.injectAxeThenAxeCheck();
    });
  });
});
