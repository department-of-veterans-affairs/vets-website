import { generateFeatureToggles } from '../../../mocks/feature-toggles';
import { cernerUser } from '../../../mocks/users';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('MyVA Dashboard - Appointments - v2', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(cernerUser);
    cy.intercept('/v0/feature_toggles*', generateFeatureToggles());
  });

  it('Header still exists when cerner message exists', () => {
    cy.visit('my-va/');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="cerner-widget"] > .hydrated').should('exist');
    cy.get('[data-testid="health-care-section-header"]').should('exist');
  });
});
