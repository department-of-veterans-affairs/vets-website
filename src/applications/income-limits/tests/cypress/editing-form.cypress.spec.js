import * as h from '../helpers';

describe('editing form', () => {
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

    // Year
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

    // Review
    h.verifyElement(h.REVIEWPAGE);
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
