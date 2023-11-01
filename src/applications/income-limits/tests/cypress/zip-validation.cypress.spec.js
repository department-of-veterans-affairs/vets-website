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
      `We’ve run into a problemWe’re sorry. Something went wrong on our end. Please try again.`,
    );
    h.verifyLoadingIndicatorNotShown();

    h.clearInput(h.ZIPINPUT);
    h.verifyAlertNotShown();
  });
});
