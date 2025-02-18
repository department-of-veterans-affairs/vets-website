import * as h from '../helpers';

describe('past year flow', () => {
  it('navigates through the flow successfully forward and backward', () => {
    cy.visit('/health-care/income-limits');

    // Home
    h.verifyElement(h.CURRENT_LINK);
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
    h.typeInInput(h.YEARINPUT, h.YEAR);
    h.clickBack();

    // Home
    h.verifyElement(h.CURRENT_LINK);
  });
});
