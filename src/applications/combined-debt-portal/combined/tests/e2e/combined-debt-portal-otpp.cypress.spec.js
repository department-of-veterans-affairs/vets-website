import mockUser81 from './fixtures/mocks/mock-user-81.json';
import { copayResponses, debtResponses } from './helpers/cdp-helpers';

describe('CDP - One Thing Per Page', () => {
  beforeEach(() => {
    cy.login(mockUser81);
  });

  context('One thing per page feature flag active', () => {
    const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'combined_debt_portal_access', value: true },
            { name: 'debt_letters_show_letters_vbms', value: false },
            { name: 'show_one_va_debt_letter', value: true },
            { name: 'dispute_debt', value: true },
          ],
        },
      }).as('features');

      copayResponses.good('copays');
      debtResponses.good('debts');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copays', '@debts']);
      cy.findByTestId('overview-page-title').should('exist');
    });

    // baseline, show the overview page
    it('should display Copay and Debt summary-cards', () => {
      cy.findByTestId('balance-card-copay')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '61.00');
        });
      cy.findByTestId('balance-card-debt')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '3,305.40');
        });

      cy.findByTestId('balance-card-zero-copay').should('not.exist');
      cy.findByTestId('balance-card-zero-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    context('copay pages', () => {
      it('should show new links on balance cards', () => {
        copayResponses.detail(id);

        cy.findByTestId('balance-card-copay')
          .findByTestId('card-link')
          .click();

        // Legacy link should not be present
        cy.findByTestId(`balance-card-${id}`)
          .findByTestId(`detail-link-${id}`)
          .should('not.contain', 'Check details');

        // // Review details link should be present and work
        cy.get(`[data-testid="detail-link-${id}"]`)
          .shadow()
          .find('a')
          .as('detailLink');
        cy.get('@detailLink').should('contain', 'Review details');
        cy.get('@detailLink').click();

        cy.url().should('match', /\/copay-balances\/[a-f0-9-]+$/);

        cy.go('back');

        // Resolve this bill link should be present and work
        cy.get(`[data-testid="resolve-link-${id}"]`)
          .shadow()
          .find('a')
          .as('resolveLink');
        cy.get('@resolveLink').should('contain', 'Resolve this bill');
        cy.get('@resolveLink').click();
        cy.url().should(
          'match',
          /\/copay-balances\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/resolve$/i,
        );

        cy.injectAxeThenAxeCheck();
      });

      it('should navigate to resolve page and show content', () => {
        cy.findByTestId('balance-card-copay')
          .findByTestId('card-link')
          .click();

        cy.get(`[data-testid="resolve-link-${id}"]`)
          .shadow()
          .find('a')
          .click();

        cy.location('pathname').should(
          'match',
          /\/copay-balances\/.*\/resolve$/,
        );

        cy.injectAxeThenAxeCheck();
      });

      it('renders resolve page content after navigation', () => {
        cy.findByTestId('balance-card-copay')
          .findByTestId('card-link')
          .click();

        // Re-stub the detail API right before clicking the resolve link
        copayResponses.detail(id);

        cy.get(`[data-testid="resolve-link-${id}"]`)
          .shadow()
          .find('a')
          .click();

        cy.url().should('match', new RegExp(`/copay-balances/${id}/resolve$`));

        cy.findByTestId('resolve-page-title').should('exist');
        cy.get('va-on-this-page').should('exist');
        cy.findByTestId('how-to-pay').should('exist');
        cy.findByTestId('financial-help').should('exist');
        cy.findByTestId('dispute-charges').should('exist');
        cy.get('va-need-help').should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it('should show new version of balances page', () => {
        cy.findByTestId('balance-card-copay')
          .findByTestId('card-link')
          .click();

        cy.get('va-on-this-page').should('not.exist');
        cy.findByTestId('how-to-pay').should('not.exist');
        cy.findByTestId('financial-help').should('not.exist');
        cy.findByTestId('dispute-charges').should('not.exist');

        cy.findByTestId('other-va-debts-head').should('exist');
        cy.findByTestId('need-help').should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it.skip('should show new version of details page', () => {
        // Setup feature flags FIRST
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            features: [
              { name: 'combined_debt_portal_access', value: true },
              { name: 'debt_letters_show_letters_vbms', value: false },
              { name: 'show_one_va_debt_letter', value: true },
              { name: 'dispute_debt', value: true },
              { name: 'vha_show_payment_history', value: true },
            ],
          },
        }).as('features2');

        // Then setup data intercepts
        copayResponses.good('copays2');
        debtResponses.good('debts2');
        copayResponses.detail(id);

        // Now visit
        cy.visit('/manage-va-debt/summary');
        cy.wait(['@features2', '@copays2', '@debts2']);

        // Reload to pick up the new flag
        cy.visit('/manage-va-debt/summary');
        cy.wait(['@features2', '@copays2', '@debts2']);

        // Bills select from summary page
        cy.findByTestId('balance-card-copay')
          .findByTestId('card-link')
          .click();

        // Specific copay selection
        cy.findByTestId(`balance-card-${id}`)
          .findByTestId(`detail-link-${id}`)
          .click();

        cy.findByTestId('detail-copay-page-title-otpp').should('exist');
        cy.findByTestId('detail-page-title').should('not.exist');
        cy.findByTestId('copay-past-due-alert').should('exist');

        // lighthouse statement table should not be present
        cy.findByTestId('payment-history-statement-table').should('not.exist');

        // most recent statement charge table should be present
        cy.findByTestId('statement-charges-head').should('exist');

        // download current statement section should be present
        cy.findByTestId('download-statement-section').should('exist');

        // previous statement links should be present
        // without the most recent statement (otpp-statement-list)
        cy.findByTestId('otpp-statement-list').should('exist');
        cy.findByTestId('statement-list').should('not.exist');

        cy.findByTestId('statement-address-head').should('exist');

        cy.injectAxeThenAxeCheck();
      });
    });

    context('debt pages', () => {
      it('should show new links on balance cards', () => {
        cy.findByTestId('balance-card-debt')
          .findByTestId('card-link')
          .click();

        // check legacy link is not present
        cy.findByTestId('debt-details-button').should('not.exist');

        // Review details link should be present and work
        cy.get('[data-testid="debt-summary-item"]')
          .findByTestId('debt-details-link')
          .shadow()
          .find('a')
          .as('detailLink');
        cy.get('@detailLink').should('contain', 'Review details');
        cy.get('@detailLink').click();
        cy.url().should('match', /\/debt-balances\/[a-f0-9-]+$/);

        cy.go('back');

        // Resolve this overpayment link should be present and work
        cy.get('[data-testid="debt-summary-item"]')
          .findByTestId('debt-resolve-link')
          .shadow()
          .find('a')
          .as('resolveLink');
        cy.get('@resolveLink').should('contain', 'Resolve this overpayment');
        cy.get('@resolveLink').click();
        cy.url().should('match', /\/debt-balances\/\d+\/resolve$/);

        cy.injectAxeThenAxeCheck();
      });

      it('should navigate to resolve page and show content', () => {
        cy.findByTestId('balance-card-debt')
          .findByTestId('card-link')
          .click();

        cy.get('[data-testid="debt-summary-item"]')
          .findByTestId('debt-resolve-link')
          .shadow()
          .find('a')
          .click();

        cy.findByTestId('detail-page-title').contains('Resolve overpayment');

        cy.get('va-on-this-page').should('exist');
        cy.get('#howDoIPay').should('exist');
        cy.get('#howDoIGetHelp').should('exist');
        cy.get('#howDoIDispute').should('exist');
        cy.get('va-need-help').should('exist');

        cy.injectAxeThenAxeCheck();
      });

      it('should show new version of details page', () => {
        cy.findByTestId('balance-card-debt')
          .findByTestId('card-link')
          .click();

        cy.get('[data-testid="debt-summary-item"]')
          .findByTestId('debt-details-link')
          .shadow()
          .find('a')
          .click();

        // do not show legacy sections
        cy.get('va-on-this-page').should('not.exist');
        cy.get('#howDoIPay').should('not.exist');
        cy.findByTestId('financial-help').should('not.exist');
        cy.findByTestId('dispute-charges').should('not.exist');

        // payment history hidden with cdp history disabled
        cy.get('#debtDetailsHeader').should('not.exist');

        // 'why might I have...' accordion & not additional info component
        cy.get('va-accordion').should('exist');
        cy.get('va-additional-info').should('not.exist');

        // show debt details section
        cy.findByTestId('otpp-details-header').should('exist');
        cy.findByTestId('debt-details-header').should('not.exist');

        // show 'debt letter history' section (if applicable)
        cy.get('#debtLetterHistory').should('exist');

        // show 'need help' footer
        cy.get('va-need-help').should('exist');

        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
