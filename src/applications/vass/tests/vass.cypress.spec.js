import manifest from '../manifest.json';

describe(manifest.appName, () => {
  it('is accessible', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
  });
});
