import manifest from '../manifest.json';

// Trigger CI E2E — safe to revert
describe(manifest.appName, () => {
  it('is accessible', () => {
    cy.login();
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
  });
});
