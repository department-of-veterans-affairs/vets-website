import { setup } from '@@profile/tests/e2e/personal-information/setup';

describe('Content on the personal information page', () => {
  it('should render personal information as expected', () => {
    setup({ isEnhanced: true });

    // Check legal name
    cy.findByTestId('legalNameField')
      .contains('Wesley Watson Ford')
      .should('exist');

    // Check preferred name and value is shown
    cy.findByTestId('preferredName')
      .children()
      .findByText('Wes')
      .should('exist');

    // Check gender identity
    cy.findByText('Man').should('exist');

    // check disability rating
    cy.findByTestId('disabilityRatingField')
      .contains('90% service connected')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
