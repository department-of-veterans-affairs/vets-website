/**
 * [TestRail-integrated] Spec for Combined Debt Portal (CDP) - Combined Statements page
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 5258
 * @testrailinfo runName CDP-E2E-Combined-Statements
 */

import mockUser81 from './fixtures/mocks/mock-user-81.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import {
  copayResponses,
  debtResponses,
  vbmsResponses,
} from './helpers/cdp-helpers';

describe('CDP - Combined statements', () => {
  beforeEach(() => {
    cy.login(mockUser81);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    vbmsResponses.empty('debtLetters');
  });

  context('User has no Copays or Debts', () => {
    beforeEach(() => {
      copayResponses.empty('copaysA');
      debtResponses.empty('debtsA');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysA', '@debtsA']);
    });

    it('should display page sections correctly', () => {
      cy.findByTestId('detail-page-title').should('exist');
      cy.findByTestId('combined-statements-veteran-info').should('exist');
      cy.findByTestId('combined-statements-recipient-info').should('exist');
      cy.findByTestId('combined-statements-copay-table-TESTFACILITY').should(
        'not.exist',
      );
      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has Copays only', () => {
    beforeEach(() => {
      copayResponses.good('copaysB');
      debtResponses.empty('debtsB');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysB', '@debtsB']);
    });

    it('should display copay table correctly', () => {
      cy.findByTestId('detail-page-title').should('exist');
      cy.findByTestId('combined-statements-veteran-info').should('exist');
      cy.findByTestId('combined-statements-recipient-info').should('exist');
      cy.get(
        '[data-testid="combined-statements-copay-table-Ralph H. Johnson Department of Veterans Affairs Medical Center"] > va-table-inner.hydrated',
      ).should('exist');
      cy.get(
        '[data-testid="combined-statements-copay-table-Bob Stump Department of Veterans Affairs Medical Center"] > va-table-inner.hydrated',
      ).should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  // context('User has Debts only', () => {
  //   beforeEach(() => {
  //     copayResponses.empty('copaysC');
  //     debtResponses.good('debtsC');

  //     cy.visit('/manage-va-debt/summary/combined-statements');
  //     cy.wait(['@features', '@copaysC', '@debtsC']);
  //     cy.findByTestId('detail-page-title').should('exist');
  //   });
  // });

  // context('User has both Copays and Debts', () => {
  //   beforeEach(() => {
  //     copayResponses.good('copaysD');
  //     debtResponses.good('debtsD');

  //     cy.visit('/manage-va-debt/summary/combined-statements');
  //     cy.wait(['@features', '@copaysD', '@debtsD']);
  //     cy.findByTestId('detail-page-title').should('exist');
  //   });

  //   it('should navigate to Copay-list & Debt-list pages - C18024', () => {
  //     cy.findByTestId('balance-card-copay')
  //       .findByTestId('card-link')
  //       .click();
  //     cy.url().should('match', /\/copay-balances$/);

  //     cy.go('back');
  //     cy.findByTestId('balance-card-debt')
  //       .findByTestId('card-link')
  //       .click();
  //     cy.url().should('match', /\/debt-balances$/);

  //     cy.injectAxeThenAxeCheck();
  //   });
  // });

  // context('User is not enrolled in healthcare', () => {
  //   it('should display not enrolled in healthcare alert', () => {
  //     copayResponses.notEnrolled('copaysNE');
  //     debtResponses.good('debtsNE');

  //     cy.visit('/manage-va-debt/summary');
  //     cy.wait(['@features', '@copaysNE', '@debtsNE']);

  //     cy.findByTestId('overview-page-title').should('exist');
  //     cy.findByTestId('no-healthcare-alert').should('exist');

  //     cy.injectAxeThenAxeCheck();
  //   });
  // });

  // context('Error states', () => {
  //   it('should display Copays error message upon copays API-404-error - C18216', () => {
  //     copayResponses.bad('copaysE1');
  //     debtResponses.good('debtsE1');

  //     cy.visit('/manage-va-debt/summary');
  //     cy.wait(['@features', '@copaysE1', '@debtsE1']);
  //     cy.findByTestId('overview-page-title').should('exist');

  //     cy.findByTestId('balance-card-alert-copay').should('exist');
  //     cy.findByTestId('balance-card-copay').should('not.exist');

  //     cy.injectAxeThenAxeCheck();
  //   });

  //   it('should display Debts error message upon debts API-404-error - C18217', () => {
  //     copayResponses.good('copaysE2');
  //     debtResponses.bad('debtsE2');

  //     cy.visit('/manage-va-debt/summary');
  //     cy.wait(['@features', '@copaysE2', '@debtsE2']);

  //     cy.findByTestId('overview-page-title').should('exist');
  //     cy.findByTestId('balance-card-alert-debt').should('exist');
  //     cy.findByTestId('balance-card-debt').should('not.exist');

  //     cy.injectAxeThenAxeCheck();
  //   });

  //   it('should display Combined error message upon both API-404-errors - C18218', () => {
  //     copayResponses.bad('copaysE3');
  //     debtResponses.bad('debtsE3');

  //     cy.visit('/manage-va-debt/summary');
  //     cy.wait(['@features', '@copaysE3', '@debtsE3']);
  //     cy.findByTestId('overview-page-title').should('exist');

  //     cy.findByTestId('balance-card-combo-alert-error').should('exist');
  //     cy.findByTestId('balance-card-copay').should('not.exist');
  //     cy.findByTestId('balance-card-debt').should('not.exist');

  //     cy.injectAxeThenAxeCheck();
  //   });
  // });
});
