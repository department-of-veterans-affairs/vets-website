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
    h.checkAccordionValue(h.RESULTS_1, '$16,037 or less');
    h.checkAccordionValue(h.RESULTS_2, '$16,038 - $39,849');
    h.checkAccordionValue(h.RESULTS_3, '$39,850 - $46,450');
    h.checkAccordionValue(h.RESULTS_4, '$46,451 - $51,095');
    h.checkAccordionValue(h.RESULTS_5, '$51,096 or more');
  });
});
