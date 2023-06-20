export const YEAR = '2017';
export const NEWYEAR = '2015';
export const YEARINPUT = 'il-year';

export const ZIP = '10108';
export const NEWZIP = '90210';
export const ZIPINPUT = 'il-zipCode';

export const DEPENDENTS = 2;
export const NEWDEPS = 4;
export const DEPINPUT = 'il-dependents';

export const REVIEWPAGE = 'il-review';

export const RESULTSPAGE = 'il-results';

export const clickBack = () =>
  cy
    .findByTestId('il-buttonPair')
    .shadow()
    .get('button')
    .first()
    .should('be.visible')
    .click();

export const clickContinue = () =>
  cy
    .findByTestId('il-buttonPair')
    .shadow()
    .get('button')
    .eq(1)
    .should('be.visible')
    .click();

export const typeInInput = (selector, value) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('input')
    .first()
    .click()
    .type(value, { force: true });

export const clearInput = selector =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('input')
    .first()
    .clear();

export const selectFromDropdown = (selector, value) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('select')
    .first()
    .select(value);

export const checkInputText = (selector, expectedValue) =>
  cy.findByTestId(selector).should('have.value', expectedValue);
export const verifyElement = selector =>
  cy.findByTestId(selector).should('exist');

export const getEditLink = index => cy.get('.va-button-link').eq(index);
export const getTdCell = index => cy.get('td').eq(index);
