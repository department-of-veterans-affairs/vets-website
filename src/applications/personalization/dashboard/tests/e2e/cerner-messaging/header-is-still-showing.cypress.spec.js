import { cernerUser } from '../../../../common/mocks/users';
import vamcErc from '../../fixtures/vamc-ehr.json';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('MyVA Dashboard - Appointments', () => {
  beforeEach(() => {
    mockLocalStorage();
    cy.login(cernerUser);

    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcErc);
  });

  it('Header still exists when cerner message exists', () => {
    cy.visit('my-va/');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="cerner-widget"] > .hydrated').should('exist');
    cy.findByTestId('health-care-section-header').should('exist');
  });
});
