import { mockLocalStorage } from './dashboard-e2e-helpers';
import mockNotInMPIUser from '~/applications/personalization/profile/tests/fixtures/users/user-not-in-mpi.json';
import { mockGETEndpoints } from '~/applications/personalization/profile/tests/e2e/helpers';

describe('MyVA Dashboard', () => {
  describe('when the user does not exist in MPI', () => {
    beforeEach(() => {
      mockLocalStorage();

      cy.login(mockNotInMPIUser);
      mockGETEndpoints([
        'v0/profile/ch33_bank_accounts',
        'v0/profile/full_name',
        'v0/profile/personal_information',
        'v0/profile/service_history',
        'v0/disability_compensation_form/rating_info',
        'v0/feature_toggles*',
        'v0/health_care_applications/enrollment_status',
      ]);
    });
    it('should show a "not in MPI" error in place of the claims/appeals and health care sections', () => {
      cy.visit('my-va/');

      cy.wait('@mockUser');

      cy.findByRole('heading', {
        name: /We can’t match your information with our Veteran records/i,
      }).should('exist');
      cy.findByText(/Try again soon/i).should('exist');
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByTestId('dashboard-section-claims-and-appeals').should(
        'not.exist',
      );

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
