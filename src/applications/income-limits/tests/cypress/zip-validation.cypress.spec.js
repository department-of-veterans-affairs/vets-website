import * as h from '../helpers';

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
      `Error Alert Your answer didn’t go through.We’re sorry. There’s a problem with our system. Refresh this page or try again later.`,
    );
    h.verifyLoadingIndicatorNotShown();

    h.clearInput(h.ZIPINPUT);
    h.verifyAlertNotShown();
  });
});
