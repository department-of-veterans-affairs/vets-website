import * as h from '../helpers';

describe('form validation', () => {
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
        'ErrorPlease enter a number between 0 and 100.',
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

      h.checkFormAlertText(h.YEARINPUT, 'ErrorPlease select a year.');
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
        'ErrorPlease enter a valid 5 digit zip code.',
      );

      h.clearInput(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '00000');
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.clickContinue();

      h.checkFormAlertText(
        h.ZIPINPUT,
        'ErrorPlease enter a valid 5 digit zip code.',
      );

      h.clearInput(h.ZIPINPUT);
      h.typeInInput(h.ZIPINPUT, '78258');
      h.verifyFormErrorNotShown(h.ZIPINPUT);
      h.clickContinue();

      // Dependents
      h.verifyElement(h.DEPINPUT);
    });
  });
});
