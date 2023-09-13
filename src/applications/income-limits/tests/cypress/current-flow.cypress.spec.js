import * as h from '../helpers';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
describe('Income Limits', () => {
  describe('current year flow', () => {
    it('navigates through the flow successfully forward and backward', () => {
      cy.visit('/health-care/income-limits');

      cy.url().should('contain', '/health-care/income-limits/introduction');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickCurrent();

      // Zip code
      cy.url().should('contain', '/health-care/income-limits/zip');
      h.verifyElement(h.ZIPINPUT);
      cy.injectAxeThenAxeCheck();
      h.typeInInput(h.ZIPINPUT, h.ZIP);
      h.clickContinue();

      // Dependents
      cy.url().should('contain', '/health-care/income-limits/dependents');
      h.verifyElement(h.DEPINPUT);
      cy.injectAxeThenAxeCheck();
      h.typeInInput(h.DEPINPUT, h.DEPENDENTS);
      h.clickContinue();

      // Review
      cy.url().should('contain', '/health-care/income-limits/review');
      h.verifyElement(h.REVIEWPAGE);
      cy.injectAxeThenAxeCheck();
      h.clickContinue();

      // Results
      cy.url().should('contain', '/health-care/income-limits/results');
      h.verifyElement(h.RESULTSPAGE);
      cy.injectAxeThenAxeCheck();

      // Review
      cy.go('back');
      h.verifyElement(h.REVIEWPAGE);
      h.clickBack();

      // Dependents
      h.verifyElement(h.DEPINPUT);
      h.checkInputText(h.DEPINPUT, h.DEPENDENTS);
      h.clickBack();

      // Zip code
      h.verifyElement(h.ZIPINPUT);
      h.checkInputText(h.ZIPINPUT, h.ZIP);
      h.clickBack();

      // Home
      h.verifyElement(h.CURRENT_LINK);
    });
  });
});
