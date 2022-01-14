import './cypress-helpers';

/**
 * Go to error page for an invalid profile
 */
describe.skip('Profile Page', () => {
  it('Axe check when error is present', () => {
    cy.visit('/education/gi-bill-comparison-tool/profile/99999999');
    cy.injectAxeThenAxeCheck();
  });
});
