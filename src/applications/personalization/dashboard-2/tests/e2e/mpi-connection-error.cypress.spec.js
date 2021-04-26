import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import mockMPIErrorUser from '~/applications/personalization/profile/tests/fixtures/users/user-mpi-error.json';

import {
  disabilityCompensationExists,
  educationBenefitExists,
  healthCareInfoExists,
  mockFeatureToggles,
} from './helpers';

describe('MyVA Dashboard', () => {
  describe('when there is an error connecting to MPI', () => {
    beforeEach(() => {
      mockLocalStorage();

      cy.login(mockMPIErrorUser);
      mockFeatureToggles();
    });
    it('should show an MPI error in place of the claims/appeals and health care sections', () => {
      cy.visit('my-va/');

      cy.findByRole('heading', {
        name: /We can’t access any health care, claims, or appeals information right now/i,
      }).should('exist');
      cy.findByText(
        /Something went wrong when we tried to connect to your records. Please refresh or try again later/i,
      ).should('exist');
      cy.findByTestId('dashboard-section-health-care').should('not.exist');
      cy.findByTestId('dashboard-section-claims-and-appeals').should(
        'not.exist',
      );

      healthCareInfoExists(true);
      disabilityCompensationExists(true);
      educationBenefitExists(true);
    });
  });
});
