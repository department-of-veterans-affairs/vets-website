import manifest from '../../manifest.json';
import {
  DR_HEADING,
  NON_DR_HEADING,
} from '../../constants/results-content/common';

export const ROOT = manifest.rootUrl;
export const START_LINK = 'onramp-start';
export const RESULTS_HEADER = 'onramp-results-header';

export const clickStart = () =>
  cy
    .findByTestId(START_LINK)
    .should('be.visible')
    .click();

export const verifyUrl = link => cy.url().should('contain', `${ROOT}/${link}`);

export const verifyElement = selector =>
  cy.findByTestId(selector).should('exist');

export const selectRadio = (selector, index) =>
  cy
    .findByTestId(selector)
    .should('exist')
    .get('[data-testid=va-radio-option]')
    .eq(index)
    .click();

export const validateRadioIsNotSelected = selector =>
  cy
    .findByTestId(selector)
    .should('exist')
    .get('[data-testid=va-radio-option]')
    .should('not.be.checked');

export const clickBack = () =>
  cy
    .findByTestId('onramp-buttonPair')
    .shadow()
    .get('va-button')
    .first()
    .should('be.visible')
    .click();

export const clickContinue = () =>
  cy
    .findByTestId('onramp-buttonPair')
    .shadow()
    .get('va-button')
    .eq(1)
    .should('be.visible')
    .click();

export const verifyFormErrorNotShown = selector =>
  cy
    .findByTestId(selector)
    .get('span[role="alert"]')
    .should('have.text', '');

export const verifyFormErrorDoesNotExist = selector =>
  cy
    .findByTestId(selector)
    .get('span[role="alert"]')
    .should('not.exist');

export const checkFormAlertText = (selector, expectedValue) =>
  cy
    .findByTestId(selector)
    .get('span[role="alert"]')
    .should('be.visible')
    .should('have.text', expectedValue);

export const verifyText = (selector, expectedValue) =>
  cy
    .findByTestId(selector)
    .should('be.visible')
    .should('have.text', expectedValue);

export const verifyNonDrResultsHeader = () =>
  cy
    .findByTestId(RESULTS_HEADER)
    .should('be.visible')
    .should('have.text', NON_DR_HEADING);

export const verifyDrResultsHeader = () =>
  cy
    .findByTestId(RESULTS_HEADER)
    .should('be.visible')
    .should('have.text', DR_HEADING);
