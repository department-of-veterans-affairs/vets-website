const Timeouts = require('platform/testing/e2e/timeouts.js');
const inputs = require('./utils/inputs.json');

const componentSelector =
  'div[data-widget-type="disability-rating-calculator"]';
const deleteRowBtnSelector = 'button[data-e2e=delete]';
const drcPagePath = '/disability/about-disability-ratings/';
const inputSelector = '.ratingInput';
const calculateBtnSelector = 'button[data-e2e=calculate]';
const combinedRatingSelector = 'div[data-e2e="combined-rating"]';
const clearBtnSelector = 'button[data-e2e=clearall]';
const rowDeletionTestInput = {
  ratings: [10, 20, 30],
  combinedRating: {
    exact: 50,
    rounded: 50,
  },
};
Cypress.Commands.add('fillRatings', input => {
  const { ratings } = input;
  const ratingsLength = ratings.length;

  for (let ratingsIndex = 0; ratingsIndex < ratingsLength; ratingsIndex++) {
    const currRating = ratings[ratingsIndex];
    const getCurrRowClass = () => `.rating.row-${ratingsIndex + 1}`;

    if (ratingsIndex > 1) {
      cy.addRatingRow();
    }

    cy.get(`${getCurrRowClass()} .ratingInput`)
      .should('be.visible')
      .then(ratingInput => {
        cy.wrap(ratingInput)
          .clear()
          .type(currRating);
      });
  }
});

Cypress.Commands.add('addRatingRow', () => {
  const addRowBtnSelector = 'button[data-e2e=add]';

  cy.get(addRowBtnSelector)
    .should('be.visible')
    .then(btn => {
      cy.wrap(btn).click();
    });
});

Cypress.Commands.add('ratingsAreAllRounded', ratings => {
  for (const rating of ratings) {
    if (rating % 10 !== 0) {
      return false;
    }
  }

  return true;
});

describe('Disability Rating Calculator', () => {
  it('Should equal the correct total', () => {
    cy.visit(drcPagePath);
    cy.get(componentSelector).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.fillRatings(rowDeletionTestInput);
    cy.get(`.row-3 ${deleteRowBtnSelector}`)
      .should('be.visible')
      .then(btn => {
        cy.wrap(btn).click();
      });
    cy.get(inputSelector).should('have.length', 2);
    cy.get(clearBtnSelector)
      .should('be.visible')
      .then(btn => {
        cy.wrap(btn).click();
      });

    for (const input of inputs) {
      cy.get('.rating.row-2').should('be.visible');
      cy.fillRatings(input);
      cy.get(calculateBtnSelector)
        .should('be.visible')
        .then(btn => {
          cy.wrap(btn).click();
        });
      cy.ratingsAreAllRounded(input.ratings).then(result => {
        if (result) {
          cy.get(combinedRatingSelector, { timeout: Timeouts.slow }).should(
            'contain',
            input.combinedRating.rounded.toString(),
          );
        } else {
          cy.get('.usa-input-error-message').should('be.visible');
        }
      });

      cy.get(clearBtnSelector)
        .should('be.visible')
        .then(btn => {
          cy.wrap(btn).click();
        });
      if (inputs.indexOf(input) === 0) {
        cy.get(`.rating.row-1 ${inputSelector}`).should('have.value', '');
        cy.get(`.rating.row-2 ${inputSelector}`).should('have.value', '');
        cy.get(`.rating.row-3`).should('not.exist');
      }
    }
  });
});
