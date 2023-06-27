import {
  CURRENT_LINK,
  DEPINPUT,
  DEPENDENTS,
  NEWDEPS,
  NEWYEAR,
  NEWZIP,
  PAST_LINK,
  RESULTS_1,
  RESULTS_2,
  RESULTS_3,
  RESULTS_4,
  RESULTS_5,
  RESULTSPAGE,
  REVIEWPAGE,
  YEAR,
  YEARINPUT,
  ZIP,
  ZIPINPUT,
  checkAccordionValue,
  checkInputText,
  clearInput,
  clickBack,
  clickContinue,
  clickCurrent,
  clickPast,
  getEditLink,
  getTdCell,
  selectFromDropdown,
  typeInInput,
  verifyElement,
} from './helpers';
import standardLimits from './fixtures/standard-fixture.json';
import nonStandardLimits from './fixtures/non-standard-fixture.json';

// Temporarily disabling these tests because there is a flaky selector that fails 4 out of 20 times
// An upgrade to the latest Cypress fixes this problem and Platform is actively working on it
// https://dsva.slack.com/archives/CBU0KDSB1/p1687455543337769
xdescribe('Income Limits', () => {
  describe('current year flow', () => {
    it('navigates through the flow successfully forward and backward', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickCurrent();

      // Zip code
      verifyElement(ZIPINPUT);
      cy.injectAxeThenAxeCheck();
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      cy.injectAxeThenAxeCheck();
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      cy.injectAxeThenAxeCheck();
      clickContinue();

      // Results
      verifyElement(RESULTSPAGE);
      cy.injectAxeThenAxeCheck();

      // Review
      cy.go('back');
      verifyElement(REVIEWPAGE);
      clickBack();

      // Dependents
      verifyElement(DEPINPUT);
      checkInputText(DEPINPUT, DEPENDENTS);
      clickBack();

      // Zip code
      verifyElement(ZIPINPUT);
      checkInputText(ZIPINPUT, ZIP);
      clickBack();

      // Home
      verifyElement(CURRENT_LINK);
    });

    it('navigates correctly through editing year', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickPast();

      // Year
      verifyElement(YEARINPUT);
      selectFromDropdown(YEARINPUT, YEAR);
      clickContinue();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(YEAR);
      getTdCell(2).contains(ZIP);
      getTdCell(4).contains(DEPENDENTS);
      getEditLink(0).click();

      // Dependents
      verifyElement(YEARINPUT);
      selectFromDropdown(YEARINPUT, NEWYEAR);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(NEWYEAR);
      getTdCell(2).contains(ZIP);
      getTdCell(4).contains(DEPENDENTS);
    });

    it('navigates correctly through editing zip code', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickCurrent();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(ZIP);
      getTdCell(2).contains(DEPENDENTS);
      getEditLink(0).click();

      // Zip code
      verifyElement(ZIPINPUT);
      clearInput(ZIPINPUT);
      typeInInput(ZIPINPUT, NEWZIP, { force: true });
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(NEWZIP);
      getTdCell(2).contains(DEPENDENTS);
    });

    it('navigates correctly through editing dependents', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickCurrent();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(ZIP);
      getTdCell(2).contains(DEPENDENTS);
      getEditLink(1).click();

      // Dependents
      verifyElement(DEPINPUT);
      clearInput(DEPINPUT);
      typeInInput(DEPINPUT, NEWDEPS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      getTdCell(0).contains(ZIP);
      getTdCell(2).contains(NEWDEPS);
    });
  });

  describe('past year flow', () => {
    it('navigates through the flow successfully forward and backward', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickPast();

      // Year
      verifyElement(YEARINPUT);
      selectFromDropdown(YEARINPUT, YEAR);
      clickContinue();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      clickContinue();

      // Results
      verifyElement(RESULTSPAGE);

      // Review
      cy.go('back');
      verifyElement(REVIEWPAGE);
      clickBack();

      // Dependents
      verifyElement(DEPINPUT);
      checkInputText(DEPINPUT, DEPENDENTS);
      clickBack();

      // Zip code
      verifyElement(ZIPINPUT);
      checkInputText(ZIPINPUT, ZIP);
      clickBack();

      // Year
      verifyElement(YEARINPUT);
      selectFromDropdown(YEARINPUT, YEAR);
      clickBack();

      // Home
      verifyElement(CURRENT_LINK);
    });
  });

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
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      clickCurrent();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      clickContinue();

      // Results
      verifyElement(RESULTSPAGE);
      checkAccordionValue(RESULTS_1, '$16,037 or less', 0);
      checkAccordionValue(RESULTS_2, '$16,038 - $39,849', 1);
      checkAccordionValue(RESULTS_3, '$39,850 - $46,450', 2);
      checkAccordionValue(RESULTS_4, '$46,451 - $51,095', 3);
      checkAccordionValue(RESULTS_5, '$51,096 or more', 4);
    });
  });

  describe('non-standard flow', () => {
    before(() => {
      cy.intercept(
        'GET',
        'income_limits/v1/limitsByZipCode/10108/2017/2',
        nonStandardLimits,
      );
    });

    it('should show the correct data on the results page', () => {
      cy.visit('/health-care/income-limits-temp');

      // Home
      verifyElement(PAST_LINK);
      cy.injectAxeThenAxeCheck();
      clickPast();

      // Year
      verifyElement(YEARINPUT);
      selectFromDropdown(YEARINPUT, YEAR);
      clickContinue();

      // Zip code
      verifyElement(ZIPINPUT);
      typeInInput(ZIPINPUT, ZIP);
      clickContinue();

      // Dependents
      verifyElement(DEPINPUT);
      typeInInput(DEPINPUT, DEPENDENTS);
      clickContinue();

      // Review
      verifyElement(REVIEWPAGE);
      clickContinue();

      // Results
      verifyElement(RESULTSPAGE);
      checkAccordionValue(RESULTS_1, '$16,037 or less', 0);
      checkAccordionValue(RESULTS_2, '$16,038 - $39,849', 1);
      checkAccordionValue(RESULTS_3, '$39,850 - $43,834', 2);
      checkAccordionValue(RESULTS_4, '$43,835 or more', 3);
    });
  });
});
