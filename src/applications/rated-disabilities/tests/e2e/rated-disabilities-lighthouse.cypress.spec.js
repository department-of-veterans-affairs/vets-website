import featureToggleEnabled from './fixtures/feature-toggle-enabled.json';
import serviceConnectedOnly from './fixtures/service-connected-only.json';
import nonServiceConnectedOnly from './fixtures/non-service-connected-only.json';

const RATED_DISABILITIES_PATH = '/disability/view-disability-rating/rating';

// const testHappyPath = () => {
//   cy.intercept('GET', DISABILITIES_ENDPOINT, mockDisabilities).as(
//     'mockDisabilities',
//   );
//   cy.intercept('GET', TOTAL_RATING_ENDPOINT, mockTotalRating).as(
//     'mockTotalRating',
//   );

//   cy.findByText(/90%/).should('exist');
//   cy.findAllByText(/Diabetes mellitus0/).should('have.length', 2);
// };

// const testErrorStates = () => {
//   cy.intercept('GET', DISABILITIES_ENDPOINT, {
//     body: mockErrorResponse,
//     statusCode: 404,
//   }).as('clientError');
//   cy.intercept('GET', TOTAL_RATING_ENDPOINT, {
//     body: mockErrorResponse,
//     statusCode: 404,
//   }).as('totalRatingClientError');

//   cy.findByText(
//     /We don’t have a combined disability rating on file for you/,
//   ).should('exist');
//   cy.findByText(/We don’t have rated disabilities on file for you/).should(
//     'exist',
//   );
// };

describe('View rated disabilities', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggleEnabled).as(
      'featureToggleEnabled',
    );

    cy.login();
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
