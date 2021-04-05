import { mockFeatureToggles } from './helpers';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

import mockMPIErrorUser from '~/applications/personalization/profile/tests/fixtures/users/user-mpi-error.json';

describe('MyVA Dashboard', () => {
  describe('when there is an error connecting to MPI', () => {
    beforeEach(() => {
      mockLocalStorage();

      cy.login(mockMPIErrorUser);
      mockFeatureToggles();
    });
    it('should show the health care load error', () => {
      cy.visit('my-va/');

      cy.findByText(
        /We couldn’t retrieve your health care information/i,
      ).should('exist');
    });
  });
});
