import { mockUserWithOutIDME } from './login';

describe('Direct deposit information login alert', () => {
  /**
   *
   * @param {object} win
   */
  beforeEach(() => {
    cy.login(mockUserWithOutIDME);
    cy.intercept('GET', '/vye/v1', { statusCode: 200 });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'toggle_vye_application', value: true },
          { name: 'toggle_vye_address_direct_deposit_forms', value: true },
          { name: 'mgib_verifications_maintenance', value: false },
          { name: 'is_DGIB_endpoint', value: false },
        ],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/', {
      onBeforeLoad(win) {
        cy.stub(win.performance, 'getEntriesByType').returns([
          { type: 'reload' },
        ]);
      },
    });
  });
  it('should not show Direct Deposit form if user logged in without using ID.me', () => {
    cy.injectAxeThenAxeCheck();
    cy.login(mockUserWithOutIDME);
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[data-testid="direct-deposit-mfa-message"]').should(
      'contain',
      'Before we give you access to change your direct deposit information, we need to make sure you’re you—and not someone pretending to be you. This helps us protect your bank account and prevent fraud.',
    );
  });
});
