import pagePaths from './pagePaths';

import {
  chapter12,
  chapter3,
  chapter4,
} from './fixtures/data/maximal-data-parts';

import cypressSetup from './cypress.setup';

const START = `/${pagePaths.totalNetWorth}`; // Start at chapter 5

describe('Pensions net worth asset alert', () => {
  before(() => {
    cypressSetup({
      authenticated: true,
      isEnabled: true,
      returnUrl: START,
      prefill: { ...chapter12, ...chapter3, ...chapter4 },
    });
  });
  context('Net worth estimation', () => {
    it('should show an alert if assets are over 25000', () => {
      // start the form
      // earlier chapters have been prefilled
      cy.findByTestId('continue-your-application').click();

      // select no to do you have >$25000 in assets
      cy.get(`va-radio-option[value="N"]`).click();
      cy.get('va-button[continue]').click();

      // check the alert doesn't exist
      cy.get('va-alert[status="warning"]').should('not.exist');

      // exceed limit
      cy.get('va-text-input[name="root_netWorthEstimation"]')
        .shadow()
        .find('input')
        .type('25001');

      // check warning exists
      cy.get('va-alert[status="warning"]').should(
        'contain.text',
        'Because you have more than $25,000 in assets',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
