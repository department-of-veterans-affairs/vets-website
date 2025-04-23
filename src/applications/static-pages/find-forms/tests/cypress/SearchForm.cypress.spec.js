import * as h from './helpers';

describe('Find a VA form', () => {
  it('does not display an error on initial page load with no URL query', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('displays an error if input is empty and search is clicked', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.clickSearch();
    h.confirmErrorsDisplayed();

    cy.axeCheck();
  });

  it('displays an error if input is size one and search is clicked', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('h');
    h.clickSearch();
    h.confirmErrorsDisplayed();

    cy.axeCheck();
  });

  it('does not display an error if input is greater than one character and search is clicked', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('health');
    h.clickSearch();
    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('does not display an error on initial page load with an empty URL query', () => {
    cy.visit('/find-forms/?q= ');
    cy.injectAxeThenAxeCheck();

    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('displays an error on initial page load with a URL query of length one', () => {
    cy.visit('/find-forms/?q=h');
    cy.injectAxeThenAxeCheck();

    h.confirmErrorsDisplayed();

    cy.axeCheck();
  });

  it('does not display an error on initial page load with a URL query of length greater than one', () => {
    cy.visit('/find-forms/?q=health');
    cy.injectAxeThenAxeCheck();

    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('removes the error once a valid query has been entered into the input', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('h');
    h.clickSearch();
    h.confirmErrorsDisplayed();

    h.typeSearchTerm('health');
    h.clickSearch();
    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('does not display an error when the query is valid and text is removed', () => {
    cy.visit('/find-forms/?q=health');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('health');
    h.clickSearch();
    h.confirmNoErrors();

    h.typeSearchTerm('h');
    h.confirmNoErrors();

    cy.axeCheck();
  });

  it('does not display an error when the query is invalid and the input loses focus', () => {
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('h');
    h.focusSearchButton();
    h.confirmNoErrors();

    cy.axeCheck();
  });
});
