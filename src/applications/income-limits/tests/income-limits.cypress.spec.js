import * as h from './helpers';
import standardLimits from './fixtures/standard-fixture.json';
import nonStandardLimits from './fixtures/non-standard-fixture.json';

// Note: anything requiring a VA button click is tested here as unit tests cannot
// target the shadow DOM
xdescribe('Income Limits', () => {
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

    it('navigates correctly through editing year', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickPast();

      // Year
      h.verifyElement(h.YEARINPUT);
      h.selectFromDropdown(h.YEARINPUT, h.YEAR);
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
      h.checkListItemText(h.YEARANSWER, h.YEAR);
      h.checkListItemText(h.ZIPANSWER, h.ZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.DEPENDENTS);
      h.getEditLink(0).click();

      // Dependents
      h.verifyElement(h.YEARINPUT);
      h.selectFromDropdown(h.YEARINPUT, h.NEWYEAR);
      h.clickContinue();

      // Review
      h.verifyElement(h.REVIEWPAGE);
      h.checkListItemText(h.YEARANSWER, h.NEWYEAR);
      h.checkListItemText(h.ZIPANSWER, h.ZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.DEPENDENTS);
    });

    it('navigates correctly through editing zip code', () => {
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
      h.checkListItemText(h.ZIPANSWER, h.ZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.DEPENDENTS);
      h.getEditLink(0).click();

      // Zip code
      h.verifyElement(h.ZIPINPUT);
      h.clearInput(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, h.NEWZIP);
      h.clickContinue();

      // // Review
      // h.verifyElement(h.REVIEWPAGE);
      h.checkListItemText(h.ZIPANSWER, h.NEWZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.DEPENDENTS);
    });

    it('navigates correctly through editing dependents', () => {
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
      h.checkListItemText(h.ZIPANSWER, h.ZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.DEPENDENTS);
      h.getEditLink(1).click();

      // Dependents
      h.verifyElement(h.DEPINPUT);
      h.clearInput(h.DEPINPUT);
      h.typeInInput(h.DEPINPUT, h.NEWDEPS);
      h.clickContinue();

      // Review
      h.verifyElement(h.REVIEWPAGE);
      h.checkListItemText(h.ZIPANSWER, h.ZIP);
      h.checkListItemText(h.DEPENDENTSANSWER, h.NEWDEPS);
    });
  });

  describe('past year flow', () => {
    it('navigates through the flow successfully forward and backward', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickPast();

      // Year
      h.verifyElement(h.YEARINPUT);
      h.selectFromDropdown(h.YEARINPUT, h.YEAR);
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

      // Year
      h.verifyElement(h.YEARINPUT);
      h.selectFromDropdown(h.YEARINPUT, h.YEAR);
      h.clickBack();

      // Home
      h.verifyElement(h.CURRENT_LINK);
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
      h.checkAccordionValue(h.RESULTS_1, '$16,037 or less', 0);
      h.checkAccordionValue(h.RESULTS_2, '$16,038 - $39,849', 1);
      h.checkAccordionValue(h.RESULTS_3, '$39,850 - $46,450', 2);
      h.checkAccordionValue(h.RESULTS_4, '$46,451 - $51,095', 3);
      h.checkAccordionValue(h.RESULTS_5, '$51,096 or more', 4);
    });
  });

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
      h.selectFromDropdown(h.YEARINPUT, h.YEAR);
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
      h.checkAccordionValue(h.RESULTS_1, '$16,037 or less', 0);
      h.checkAccordionValue(h.RESULTS_2, '$16,038 - $39,849', 1);
      h.checkAccordionValue(h.RESULTS_4, '$39,850 - $43,834', 2);
      h.checkAccordionValue(h.RESULTS_5, '$43,835 or more', 3);
    });
  });

  describe('dependents validation - form errors', () => {
    it('should show the correct error state when it exists', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickCurrent();

      // Zip code
      h.verifyElement(h.ZIPINPUT);
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, h.ZIP);
      h.clickContinue();

      // Dependents
      h.verifyElement(h.DEPINPUT);
      h.typeInInput(h.DEPINPUT, '200');
      h.clickContinue();

      h.checkFormAlertText(
        h.DEPINPUT,
        'Error Please enter a number between 0 and 100.',
      );
    });
  });

  describe('year validation - form errors', () => {
    it('should show the correct error state when it exists', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickPast();

      // Year
      h.verifyElement(h.YEARINPUT);
      h.clickContinue();

      h.checkFormAlertText(h.YEARINPUT, 'Error Please select a year.');
    });
  });

  describe('zip code validation - form errors', () => {
    it('should show the correct error states when they exist', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickCurrent();

      // Zip code
      h.verifyElement(h.ZIPINPUT);
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '00');
      h.clickContinue();

      h.checkFormAlertText(
        h.ZIPINPUT,
        'Error Please enter a valid 5 digit zip code.',
      );

      h.clearInput(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '00000');
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.clickContinue();

      h.checkFormAlertText(
        h.ZIPINPUT,
        'Error Please enter a valid 5 digit zip code.',
      );

      h.clearInput(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '78258');
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.clickContinue();

      // Dependents
      h.verifyElement(h.DEPINPUT);
    });
  });

  describe('zip code validation - service errors', () => {
    before(() => {
      cy.intercept('GET', 'income_limits/v1/validateZipCode/78258', {
        statusCode: 500,
        delay: 500,
      });
    });

    it('should show the correct error states', () => {
      cy.visit('/health-care/income-limits');

      // Home
      h.verifyElement(h.CURRENT_LINK);
      cy.injectAxeThenAxeCheck();
      h.clickCurrent();

      // Zip code
      h.verifyElement(h.ZIPINPUT);
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '78258');
      h.clickContinue();

      h.verifyLoadingIndicatorShown();

      h.checkServiceAlertText(
        `We’ve run into a problemWe’re sorry. Something went wrong on our end. Please try again.`,
      );
      h.verifyLoadingIndicatorNotShown();

      h.clearInput(h.ZIPINPUT);
      h.verifyAlertNotShown();
    });
  });

  describe('retrieving results - 422 invalid zip code', () => {
    before(() => {
      cy.intercept('GET', 'income_limits/v1/limitsByZipCode/10108/2023/2', {
        statusCode: 422,
        delay: 500,
        body: {
          error: 'Invalid zip code',
        },
      });
    });

    it('should show the correct error state', () => {
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

      h.verifyLoadingIndicatorShown();

      h.checkServiceAlertText(
        `We’ve run into a problemYour information couldn’t go through. Please enter a valid 5 digit zip code.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('retrieving results - 422 invalid year', () => {
    before(() => {
      cy.intercept('GET', 'income_limits/v1/limitsByZipCode/10108/2023/2', {
        statusCode: 422,
        delay: 500,
        body: {
          error: 'Invalid year',
        },
      });
    });

    it('should show the correct error state', () => {
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

      h.verifyLoadingIndicatorShown();

      h.checkServiceAlertText(
        `We’ve run into a problemYour information couldn’t go through. Please select a year again.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('retrieving results - 422 invalid dependents', () => {
    before(() => {
      cy.intercept('GET', 'income_limits/v1/limitsByZipCode/10108/2023/2', {
        statusCode: 422,
        delay: 500,
        body: {
          error: 'Invalid dependents',
        },
      });
    });

    it('should show the correct error state', () => {
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

      h.verifyLoadingIndicatorShown();

      h.checkServiceAlertText(
        `We’ve run into a problemYour information couldn’t go through. Please enter a number of dependents between 0 and 100.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('retrieving results - response timeout', () => {
    before(() => {
      cy.intercept('GET', 'income_limits/v1/limitsByZipCode/10108/2023/2', {
        statusCode: 200,
        delay: 5500,
      });
    });

    it('should show the correct error state', () => {
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

      h.verifyLoadingIndicatorShown();

      // Cypress default timeout is 4 seconds. Our service timeout is 5 seconds
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5600);

      h.checkServiceAlertText(
        `We’ve run into a problemWe’re sorry. Something went wrong on our end. Please try again.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

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
});
