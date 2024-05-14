import * as h from '../helpers';
import standardLimits from '../fixtures/standard-fixture.json';

describe('standard flow', () => {
  before(() => {
    const currentYear = new Date().getFullYear();
    cy.intercept(
      'GET',
      `income_limits/v1/limitsByZipCode/10108/${currentYear}/2`,
      standardLimits,
    );
  });

  it('should show the correct data on the results page', () => {
    cy.visit('/health-care/income-limits');

    // Home
    h.verifyElement(h.CURRENT_LINK);
    cy.injectAxeThenAxeCheck();
    h.clickCurrent();

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
    h.checkAccordionValue(h.RESULTS_1, '$24,505 or less', 0);
    h.checkAccordionValue(h.RESULTS_2, '$24,506 - $52,180', 1);
    h.checkAccordionValue(h.RESULTS_3, '$52,181 - $101,800', 2);
    h.checkAccordionValue(h.RESULTS_4, '$101,801 - $111,980', 3);
    h.checkAccordionValue(h.RESULTS_5, '$111,981 or more', 4);
  });
});
