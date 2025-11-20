import * as h from '../helpers';
import nonStandardLimits from '../fixtures/non-standard-fixture.json';

describe('non-standard flow', () => {
  it('should show the correct data on the results page', () => {
    cy.intercept(
      'GET',
      'income_limits/v1/limitsByZipCode/10108/2017/2',
      nonStandardLimits,
    );

    cy.visit('/health-care/income-limits');

    // Home
    h.verifyElement(h.PAST_LINK);
    cy.injectAxeThenAxeCheck();
    h.clickPast();

    // Year
    h.verifyElement(h.YEARINPUT);
    h.typeInInput(h.YEARINPUT, h.YEAR);
    h.clickContinue();

    // Zip code
    h.verifyElement(h.ZIPINPUT);
    h.typeInInput(h.ZIPINPUT, h.ZIP);
    h.clickContinue();

    // Dependents
    h.verifyElement(h.DEPINPUT);
    h.typeInInput(h.DEPINPUT, h.DEPENDENTS);
    h.clickContinue();

    // Review
    h.verifyElement(h.REVIEWPAGE);
    h.clickContinue();

    // Results
    h.verifyElement(h.RESULTSPAGE);
    h.checkAccordionValue(h.RESULTS_1, '$16,037 or less');
    h.checkAccordionValue(h.RESULTS_2, '$16,038 - $39,849');
    h.checkAccordionValue(h.RESULTS_4, '$39,850 - $43,834');
    h.checkAccordionValue(h.RESULTS_5, '$43,835 or more');
  });
});
