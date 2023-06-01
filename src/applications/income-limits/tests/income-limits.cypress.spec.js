import {
  DEPINPUT,
  DEPENDENTS,
  NEWDEPS,
  NEWZIP,
  RESULTSPAGE,
  REVIEWPAGE,
  ZIP,
  ZIPINPUT,
  checkInputText,
  clearInput,
  clickBack,
  clickContinue,
  getEditLink,
  getTdCell,
  typeInInput,
  verifyElement,
} from './helpers';

describe('Income Limits', () => {
  it('navigates through the flow successfully forward and backward', () => {
    cy.visit('/health-care/income-limits-temp');

    // Zip code
    verifyElement(ZIPINPUT);
    typeInInput(ZIPINPUT, ZIP);
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Dependents
    verifyElement(DEPINPUT);
    typeInInput(DEPINPUT, DEPENDENTS);
    cy.injectAxeThenAxeCheck();
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
  });

  it('navigates correctly through editing zip code', () => {
    cy.visit('/health-care/income-limits-temp');

    // Zip code
    verifyElement(ZIPINPUT);
    typeInInput(ZIPINPUT, ZIP);
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Dependents
    verifyElement(DEPINPUT);
    typeInInput(DEPINPUT, DEPENDENTS);
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Review
    verifyElement(REVIEWPAGE);
    cy.injectAxeThenAxeCheck();
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

    // Zip code
    verifyElement(ZIPINPUT);
    typeInInput(ZIPINPUT, ZIP);
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Dependents
    verifyElement(DEPINPUT);
    typeInInput(DEPINPUT, DEPENDENTS);
    cy.injectAxeThenAxeCheck();
    clickContinue();

    // Review
    verifyElement(REVIEWPAGE);
    cy.injectAxeThenAxeCheck();
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
