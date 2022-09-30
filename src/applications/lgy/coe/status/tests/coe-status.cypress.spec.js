import manifest from '../manifest.json';

describe(manifest.appName, () => {
  it('is accessible', () => {
    cy.login();
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
  });
});
