import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import mockNotInMPIUser from '~/applications/personalization/profile/tests/fixtures/users/user-not-in-mpi.json';

import {
  disabilityCompensationExists,
  educationBenefitExists,
  healthCareInfoExists,
  mockFeatureToggles,
} from './helpers';

describe('MyVA Dashboard', () => {
  describe('when the user does not exist in MPI', () => {
    beforeEach(() => {
      mockLocalStorage();

      cy.login(mockNotInMPIUser);
      mockFeatureToggles();
    });
    it('should show a "not in MPI" error in place of the claims/appeals and health care sections', () => {
      cy.visit('my-va/');

      cy.findByRole('heading', {
        name: /We’re having trouble verifying your identity/i,
      }).should('exist');
      cy.findByText(/we can’t give you access to VA.gov tools/i).should(
        'exist',
      );
      cy.findByTestId('dashboard-section-health-care').should('not.exist');
      cy.findByTestId('dashboard-section-claims-and-appeals').should(
        'not.exist',
      );

      healthCareInfoExists(true);
      disabilityCompensationExists(true);
      educationBenefitExists(true);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
