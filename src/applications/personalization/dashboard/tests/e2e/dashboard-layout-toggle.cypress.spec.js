import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('The My VA Dashboard - My VA Layout Toggle', () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
    cy.intercept('/v0/appeals', { data: [] });
    cy.intercept('/v0/benefits_claims', { data: [] });
    cy.intercept('/v0/debts*', { data: [] });
    cy.intercept('/v0/medical_copays', { data: [] });
    cy.intercept('/v0/my_va/submission_statuses', { data: [] });
    cy.intercept('/v0/onsite_notifications', { data: [] });
    cy.intercept('/vaos/v2/appointments*', { data: [] });
    cy.intercept('/v0/profile/service_history', serviceHistory).as('serviceB');
    cy.intercept('/v0/profile/full_name', fullName).as('nameB');
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: featureFlagNames.myVaAuthExpRedesignAvailableToOptIn,
            value: true,
          },
        ],
      },
    });
    mockLocalStorage();
  });

  context('when user has no toggle preference set', () => {
    it('should show the old layout as default', () => {
      cy.login(mockUser);
      cy.visit('my-va/');

      cy.get('[data-testid="my-va-layout-toggle"][selected="1"]').should(
        'exist',
      );

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });

    it('should allow user to toggle between layouts', () => {
      cy.login(mockUser);
      cy.visit('my-va/');

      cy.get('[data-testid="my-va-layout-toggle"]')
        .shadow()
        .findByText('New My VA')
        .click();

      cy.get('[data-testid="my-va-layout-toggle"][selected="0"]').should(
        'exist',
      );

      cy.get('[data-testid="my-va-layout-toggle"]')
        .shadow()
        .findByText('Old My VA')
        .click();

      cy.get('[data-testid="my-va-layout-toggle"][selected="1"]').should(
        'exist',
      );

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has toggle preference set to new layout', () => {
    it('should show the new layout as default', () => {
      window.localStorage.setItem('myVaLayoutVersion', 'new');
      cy.login(mockUser);
      cy.visit('my-va/');

      cy.get('[data-testid="my-va-layout-toggle"][selected="0"]').should(
        'exist',
      );

      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
});
