import * as h from '../helpers';

describe('retrieving results - errors', () => {
  describe('422 invalid zip code', () => {
    before(() => {
      cy.intercept(
        'GET',
        `income_limits/v1/limitsByZipCode/10108/${new Date().getFullYear()}/2`,
        {
          statusCode: 422,
          delay: 500,
          body: {
            error: 'Invalid zip code',
          },
        },
      );
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5200);

      h.checkServiceAlertText(
        `Error Alert We've run into a problemYour information couldn’t go through. Enter a valid 5 digit zip code.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('422 invalid year', () => {
    before(() => {
      cy.intercept(
        'GET',
        `income_limits/v1/limitsByZipCode/10108/${new Date().getFullYear()}/2`,
        {
          statusCode: 422,
          delay: 500,
          body: {
            error: 'Invalid year',
          },
        },
      );
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5200);

      h.checkServiceAlertText(
        `Error Alert We've run into a problemYour information couldn’t go through. Enter a valid four digit year again.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('422 invalid dependents', () => {
    before(() => {
      cy.intercept(
        'GET',
        `income_limits/v1/limitsByZipCode/10108/${new Date().getFullYear()}/2`,
        {
          statusCode: 422,
          delay: 500,
          body: {
            error: 'Invalid dependents',
          },
        },
      );
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5200);

      h.checkServiceAlertText(
        `Error Alert We've run into a problemYour information couldn’t go through. Enter a number of dependents between 0 and 100.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });

  describe('response timeout', () => {
    before(() => {
      cy.intercept(
        'GET',
        `income_limits/v1/limitsByZipCode/10108/${new Date().getFullYear()}/2`,
        {
          statusCode: 200,
          delay: 5500,
        },
      );
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
      cy.wait(5200);

      h.checkServiceAlertText(
        `Error Alert Your answer didn’t go through.We’re sorry. There’s a problem with our system. Refresh this page or try again later.`,
      );
      h.verifyLoadingIndicatorNotShown();
    });
  });
});
