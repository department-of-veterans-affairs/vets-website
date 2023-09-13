export const START_LINK = 'paw-start-form';

export const SERVICE_PERIOD_INPUT = 'paw-servicePeriod';
export const BURN_PIT_2_1_INPUT = 'paw-burnPit2_1';

export const clickStart = () =>
  cy
    .findByTestId(START_LINK)
    .should('be.visible')
    .click();

export const verifyUrl = link =>
  cy.url().should('contain', `/pact-act-wizard-test/${link}`);

export const verifyElement = selector =>
  cy.findByTestId(selector).should('exist');

export const selectRadio = (selector, index) =>
  cy
    .findByTestId(selector)
    .should('exist')
    .get('va-radio-option')
    .eq(index)
    .click();

export const clickBack = () =>
  cy
    .findByTestId('paw-buttonPair')
    .shadow()
    .get('va-button')
    .first()
    .should('be.visible')
    .click();

export const clickContinue = () =>
  cy
    .findByTestId('paw-buttonPair')
    .shadow()
    .get('va-button')
    .eq(1)
    .should('be.visible')
    .click();

export const verifyFormErrorNotShown = selector =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('span[role="alert"]')
    .should('not.be.visible');

export const checkFormAlertText = (selector, expectedValue) =>
  cy
    .findByTestId(selector)
    .shadow()
    .get('span[role="alert"]')
    .should('be.visible')
    .should('have.text', expectedValue);
