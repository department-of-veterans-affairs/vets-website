import manifest from '../../manifest.json';
import {
  DR_HEADING,
  NON_DR_HEADING,
} from '../../constants/results-content/common';
import { ROUTES } from '../../constants';

export const ROOT = manifest.rootUrl;
export const START_LINK = 'onramp-start';

export const clickStart = () =>
  cy
    .findByTestId(START_LINK)
    .should('be.visible')
    .click();

export const verifyUrl = link => {
  if (link === ' ') {
    // For introduction with space, just verify we're at the root path
    // The space doesn't actually appear in the URL for the root route
    cy.url().should('contain', ROOT);
  } else {
    // Handle normal routes
    cy.url().should('contain', `${ROOT}/${link}`);
  }
};

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

export const verifyFormErrorDoesNotExist = selector =>
  cy
    .findByTestId(selector)
    .get('[error="ErrorPlaceholder error message"]')
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

export const navigateToResults = path => {
  // INTRODUCTION
  verifyUrl(ROUTES.INTRODUCTION);
  clickStart();

  Object.keys(path).forEach(question => {
    verifyUrl(ROUTES?.[question]);
    selectRadio(question, path[question]);
    clickContinue();
  });
};

export const navigateBackward = path => {
  Object.keys(path)
    .reverse()
    .forEach(question => {
      verifyUrl(ROUTES?.[question]);
      clickBack();
    });

  verifyUrl(ROUTES.INTRODUCTION);
};

// Results-specific
export const RESULTS_HEADER = 'onramp-results-header';

export const OVERVIEW_OPTION = 'overview-option';
export const CLAIM_FOR_INCREASE_OPTION = 'claim-for-increase-option';
export const CLAIM_FOR_INCREASE_CARD = 'claim-for-increase-card';
export const GOOD_FIT = 'good-fit';
export const NOT_GOOD_FIT = 'not-good-fit';
export const OUTSIDE_DR = 'outside-dr-option';
export const GOOD_FIT_CONTENT = 'gf-content';
export const NOT_GOOD_FIT_CONTENT = 'ngf-content';

export const GOOD_FIT_SC_CARD = `${GOOD_FIT}-CARD_SC`;
export const GOOD_FIT_HLR_CARD = `${GOOD_FIT}-CARD_HLR`;
export const GOOD_FIT_BOARD_DIRECT_CARD = `${GOOD_FIT}-CARD_BOARD_DIRECT`;
export const GOOD_FIT_BOARD_EVIDENCE_CARD = `${GOOD_FIT}-CARD_BOARD_EVIDENCE`;
export const GOOD_FIT_BOARD_HEARING_CARD = `${GOOD_FIT}-CARD_BOARD_HEARING`;

export const NOT_GOOD_FIT_SC_CARD = `${NOT_GOOD_FIT}-CARD_SC`;
export const NOT_GOOD_FIT_HLR_CARD = `${NOT_GOOD_FIT}-CARD_HLR`;
export const NOT_GOOD_FIT_BOARD_DIRECT_CARD = `${NOT_GOOD_FIT}-CARD_BOARD_DIRECT`;
export const NOT_GOOD_FIT_BOARD_EVIDENCE_CARD = `${NOT_GOOD_FIT}-CARD_BOARD_EVIDENCE`;
export const NOT_GOOD_FIT_BOARD_HEARING_CARD = `${NOT_GOOD_FIT}-CARD_BOARD_HEARING`;

export const verifyNonDrResultsHeader = expectedPage =>
  cy
    .findByTestId(`${RESULTS_HEADER}-${expectedPage}`)
    .should('be.visible')
    .should('have.text', NON_DR_HEADING);

export const verifyDrResultsHeader = expectedPage =>
  cy
    .findByTestId(`${RESULTS_HEADER}-${expectedPage}`)
    .should('be.visible')
    .should('have.text', DR_HEADING);

export const checkOverviewPanel = (expectedItems, CFI = false) => {
  const expectedCount = expectedItems?.length;

  cy.get(`[data-testid*="${OVERVIEW_OPTION}"]`).should(
    'have.length',
    expectedCount,
  );

  expectedItems.forEach((item, index) => {
    cy.findByTestId(`${OVERVIEW_OPTION}-${index}`)
      .should('be.visible')
      .should('have.text', item);
  });

  if (CFI) {
    cy.findByTestId(CLAIM_FOR_INCREASE_OPTION)
      .should('be.visible')
      .should('have.text', 'Claim for Increase');
  }
};

export const checkGoodFitCards = expectedCards => {
  const expectedCount = expectedCards?.length;

  cy.get(`[data-testid^="${GOOD_FIT}"]`).should('have.length', expectedCount);

  expectedCards.forEach(card => {
    const { type, content } = card;
    const cardContainer = `${GOOD_FIT}-${type}`;

    cy.findByTestId(cardContainer)
      .should('be.visible')
      .within(() => {
        content.forEach((item, index) => {
          cy.findByTestId(`${GOOD_FIT_CONTENT}-${index}`)
            .should('be.visible')
            .should('contain.text', item);
        });
        cy.get(`[data-testid*="${GOOD_FIT_CONTENT}"]`).should(
          'have.length',
          content.length,
        );
      });
  });
};

export const checkNotGoodFitCards = expectedCards => {
  const expectedCount = expectedCards?.length;

  cy.get(`[data-testid^="${NOT_GOOD_FIT}"]`).should(
    'have.length',
    expectedCount,
  );

  expectedCards.forEach(card => {
    const { type, content } = card;
    const cardContainer = `${NOT_GOOD_FIT}-${type}`;

    cy.findByTestId(cardContainer)
      .should('be.visible')
      .within(() => {
        content.forEach((item, index) => {
          cy.findByTestId(`${NOT_GOOD_FIT_CONTENT}-${index}`)
            .should('be.visible')
            .should('contain.text', item);
        });
        cy.get(`[data-testid*="${NOT_GOOD_FIT_CONTENT}"]`).should(
          'have.length',
          content.length,
        );
      });
  });
};

export const verifyOutsideDROptionPresent = () =>
  cy.findByTestId(OUTSIDE_DR).should('be.visible');

export const verifyOutsideDROptionNotPresent = () =>
  cy.findByTestId(OUTSIDE_DR).should('not.exist');

export const verifyClaimForIncreaseCardPresent = () =>
  cy.findByTestId(CLAIM_FOR_INCREASE_CARD).should('be.visible');

export const verifyClaimForIncreaseCardNotPresent = () =>
  cy.findByTestId(CLAIM_FOR_INCREASE_CARD).should('not.exist');
