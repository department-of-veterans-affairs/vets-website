import manifest from '../manifest.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(() => {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      data: {
        nodeQuery: {
          count: 0,
          entities: [],
        },
      },
    });
    cy.injectAxe();
  });

  it('can start a call', () => {
    cy.visit(manifest.rootUrl);
    cy.findByTitle('Call');

    cy.axeCheck();
  });
});
