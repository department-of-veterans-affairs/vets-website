export const CURRENT_LINK = 'income-limits-current';
export const PAST_LINK = 'income-limits-past';

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
export const YEARANSWER = 'review-year';
export const ZIPANSWER = 'review-zip';
export const DEPENDENTSANSWER = 'review-dependents';

export const RESULTSPAGE = 'il-results';
export const RESULTS_1 = 'il-results-1';
export const RESULTS_2 = 'il-results-2';
export const RESULTS_3 = 'il-results-3';
export const RESULTS_4 = 'il-results-4';
export const RESULTS_5 = 'il-results-5';

export const clickCurrent = () =>
  cy
    .findByTestId(CURRENT_LINK)
    .should('be.visible')
    .click();

export const clickPast = () =>
  cy
    .findByTestId(PAST_LINK)
    .should('be.visible')
    .click();

export const clickBack = () =>
  cy
    .findByTestId('il-buttonPair')
    .shadow()
    .get('va-button')
    .first()
    .should('be.visible')
    .click();

export const clickContinue = () =>
  cy
    .findByTestId('il-buttonPair')
    .shadow()
    .get('va-button')
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

export const checkFormAlertText = (selector, expectedValue) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('span[role="alert"]')
    .should('be.visible')
    .should('have.text', expectedValue);

export const checkServiceAlertText = expectedValue =>
  cy.findByTestId('il-service-error').should('have.text', expectedValue);

export const clearInput = selector =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('input')
    .first()
    .focus()
    .clear();

export const selectFromDropdown = (selector, value) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('select')
    .first()
    .select(value, { force: true });

export const checkInputText = (selector, expectedValue) =>
  cy.findByTestId(selector).should('have.value', expectedValue);

export const checkAccordionValue = (selector, expectedValue, index) =>
  cy
    .findByTestId(RESULTSPAGE)
    .findByTestId(selector)
    .shadow()
    .get('button')
    .eq(index)
    .should('have.text', expectedValue);

export const verifyElement = selector =>
  cy.findByTestId(selector).should('exist');

export const verifyFormErrorNotShown = selector =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('span[role="alert"]')
    .should('not.be.visible');

export const verifyAlertNotShown = () =>
  cy.findByTestId('il-service-error').should('not.exist');

export const verifyLoadingIndicatorShown = () =>
  cy
    .findByTestId('il-loading-indicator')
    .shadow()
    .get('div[role="progressbar"')
    .should('be.visible');

export const verifyLoadingIndicatorNotShown = () =>
  cy.findByTestId('il-loading-indicator').should('not.exist');

export const getEditLink = index =>
  cy.get('.income-limits-edit va-link').eq(index);
export const checkListItemText = (selector, expectedValue) =>
  cy.findByTestId(selector).should('contain.text', expectedValue);
