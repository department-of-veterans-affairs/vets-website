import featureToggleEnabled from './fixtures/feature-toggle-enabled.json';
import serviceConnectedOnly from './fixtures/service-connected-only.json';
import noCombinedRating from './fixtures/no-combined-rating.json';
import noRatings from './fixtures/no-ratings.json';
import nonServiceConnectedOnly from './fixtures/non-service-connected-only.json';

const RATED_DISABILITIES_PATH = '/disability/view-disability-rating/rating';

describe('View rated disabilities', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggleEnabled).as(
      'featureToggleEnabled',
    );

    cy.login();
  });

  context('when there is no combined rating', () => {
    beforeEach(() => {
      cy.intercept('v0/rated_disabilities', noCombinedRating);
      cy.visit(RATED_DISABILITIES_PATH);
    });

    it('should display an alert indicating that there is no combined rating', () => {
      cy.findByText(
        'We don’t have a combined disability rating on file for you',
      ).should('exist');
      cy.get('va-summary-box').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when there are no ratings', () => {
    beforeEach(() => {
      cy.intercept('v0/rated_disabilities', noRatings);
      cy.visit(RATED_DISABILITIES_PATH);
    });

    it('should display an alert indicating that there are no ratings', () => {
      cy.findByText(
        'We don’t have any rated disabilities on file for you',
      ).should('exist');
      cy.get('.rating-list').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when there are only service-connected ratings', () => {
    beforeEach(() => {
      cy.intercept('v0/rated_disabilities', serviceConnectedOnly);
      cy.visit(RATED_DISABILITIES_PATH);
    });

    it('should display a list of service-connected ratings', () => {
      cy.findByText('Service-connected ratings').should('exist');
      cy.get('.rating-list > va-card').should('have.length', 3);

      cy.injectAxeThenAxeCheck();
    });

    it('should not display the non-service-connected ratings section', () => {
      cy.findByText('Conditions VA determined aren’t service-connected').should(
        'not.exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when there are only non-service-connected ratings', () => {
    beforeEach(() => {
      cy.intercept('v0/rated_disabilities', nonServiceConnectedOnly);
      cy.visit(RATED_DISABILITIES_PATH);
    });

    it('should display a list of service-connected ratings', () => {
      cy.findByText('Conditions VA determined aren’t service-connected').should(
        'exist',
      );
      cy.get('.rating-list > va-card').should('have.length', 2);

      cy.injectAxeThenAxeCheck();
    });

    it('should not display the service-connected ratings section', () => {
      cy.findByText('Service-connected ratings').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
