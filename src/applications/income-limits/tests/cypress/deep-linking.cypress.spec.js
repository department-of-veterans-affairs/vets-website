import * as h from '../helpers';

describe('preventing deep linking', () => {
  it('should redirect to home if an URL is navigated to without the correct data', () => {
    cy.visit('/health-care/income-limits');

    // Home
    h.verifyElement(h.CURRENT_LINK);
    cy.injectAxeThenAxeCheck();

    cy.visit('/health-care/income-limits/zip');
    // Home
    h.verifyElement(h.CURRENT_LINK);

    cy.visit('/health-care/income-limits/dependents');
    // Home
    h.verifyElement(h.CURRENT_LINK);

    cy.visit('/health-care/income-limits/year');
    // Home
    h.verifyElement(h.CURRENT_LINK);

    cy.visit('/health-care/income-limits/results');
    // Home
    h.verifyElement(h.CURRENT_LINK);

    cy.visit('/health-care/income-limits/review');
    // Home
    h.verifyElement(h.CURRENT_LINK);
  });
});
