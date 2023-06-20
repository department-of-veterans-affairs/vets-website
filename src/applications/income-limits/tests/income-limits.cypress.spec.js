import {
  DEPINPUT,
  DEPENDENTS,
  NEWDEPS,
  NEWYEAR,
  NEWZIP,
  RESULTSPAGE,
  REVIEWPAGE,
  YEAR,
  YEARINPUT,
  ZIP,
  ZIPINPUT,
  checkInputText,
  clearInput,
  clickBack,
  clickContinue,
  getEditLink,
  getTdCell,
  selectFromDropdown,
  typeInInput,
  verifyElement,
} from './helpers';

describe('Income Limits', () => {
  it('navigates through the flow successfully forward and backward', () => {
    cy.visit('/health-care/income-limits-temp');

    // Temporarily adding year for all flows because we're defaulting to past flow
    // until we have a URL governing where we're coming from
    // Year
    verifyElement(YEARINPUT);
    cy.injectAxeThenAxeCheck();
    selectFromDropdown(YEARINPUT, YEAR);
    clickContinue();

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

    // Year
    verifyElement(YEARINPUT);
    checkInputText(YEARINPUT, YEAR);
  });

  it('navigates correctly through editing year', () => {
    cy.visit('/health-care/income-limits-temp');

    // Temporarily adding year for all flows because we're defaulting to past flow
    // until we have a URL governing where we're coming from
    // Year
    verifyElement(YEARINPUT);
    cy.injectAxeThenAxeCheck();
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

    // Temporarily adding year for all flows because we're defaulting to past flow
    // until we have a URL governing where we're coming from
    // Year
    verifyElement(YEARINPUT);
    cy.injectAxeThenAxeCheck();
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
    getTdCell(2).contains(ZIP);
    getTdCell(4).contains(DEPENDENTS);
    getEditLink(1).click();

    // Zip code
    verifyElement(ZIPINPUT);
    clearInput(ZIPINPUT);
    typeInInput(ZIPINPUT, NEWZIP, { force: true });
    clickContinue();

    // Review
    verifyElement(REVIEWPAGE);
    getTdCell(0).contains(YEAR);
    getTdCell(2).contains(NEWZIP);
    getTdCell(4).contains(DEPENDENTS);
  });

  it('navigates correctly through editing dependents', () => {
    cy.visit('/health-care/income-limits-temp');

    // Temporarily adding year for all flows because we're defaulting to past flow
    // until we have a URL governing where we're coming from
    // Year
    verifyElement(YEARINPUT);
    cy.injectAxeThenAxeCheck();
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
    getTdCell(2).contains(ZIP);
    getTdCell(4).contains(DEPENDENTS);
    getEditLink(2).click();

    // Dependents
    verifyElement(DEPINPUT);
    clearInput(DEPINPUT);
    typeInInput(DEPINPUT, NEWDEPS);
    clickContinue();

    // Review
    verifyElement(REVIEWPAGE);
    getTdCell(0).contains(YEAR);
    getTdCell(2).contains(ZIP);
    getTdCell(4).contains(NEWDEPS);
  });
});
