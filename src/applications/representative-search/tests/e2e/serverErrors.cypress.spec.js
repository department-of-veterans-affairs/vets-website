import { generateFeatureToggles } from '../../mocks/feature-toggles';

describe('Find a Representative error handling', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'find_a_representative', value: true }],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/veteran/v0/vso_accredited_representatives?**',
      {
        statusCode: 500,
        body: {
          error: 'server error',
        },
      },
    ).as('getServerError');

    cy.visit('/get-help-from-accredited-representative/find-rep/');
    generateFeatureToggles();
  });

  it('should show an error if the API returns a non-200 response', () => {
    cy.injectAxe();

    cy.axeCheck();

    cy.get('#street-city-state-zip')
      .find('input[type="text"]')
      .type('Austin, TX');

    cy.get('#representative-search').click({ waitForAnimations: true });
    cy.wait('@getServerError');

    cy.get('#search-results-title')
      .find('h2')
      .contains('something went wrong');
  });
});
