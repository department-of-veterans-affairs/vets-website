// These tests work locally, but they will not succeed in the CI
// until the content-build changes have been merged in to register the application
xdescribe('Income Limits', () => {
  const clickBack = () =>
    cy
      .findByTestId('il-buttonPair')
      .shadow()
      .get('button')
      .first()
      .click();

  const clickContinue = () =>
    cy
      .findByTestId('il-buttonPair')
      .shadow()
      .get('button')
      .eq(1)
      .click();

  const typeZip = () =>
    cy
      .findByTestId('il-zipCode')
      .shadow()
      .get('input')
      .first()
      .type('10108');

  const typeDependents = () =>
    cy
      .findByTestId('il-dependents')
      .shadow()
      .get('input')
      .first()
      .type('2');

  const verifyElement = selector => cy.findByTestId(selector).should('exist');

  it('navigates through the flow successfully forward and backward', () => {
    cy.visit('/health-care/income-limits-temp');

    // Zip code
    verifyElement('il-zipCode');
    typeZip();
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Dependents
    verifyElement('il-dependents');
    typeDependents();
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Review
    verifyElement('il-review');
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Results
    verifyElement('il-results');
    cy.injectAxeThenAxeCheck();

    // Review
    cy.go('back');
    verifyElement('il-review');
    clickBack();

    // Dependents
    verifyElement('il-dependents');
    clickBack();

    // Zip code
    verifyElement('il-zipCode');
  });
});
