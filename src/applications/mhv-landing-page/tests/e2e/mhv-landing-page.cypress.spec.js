import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('Visit bad URL', () => {
    cy.visit(`${manifest.rootUrl}/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: /we can’t find that page/ }).should.exist;
  });
});
