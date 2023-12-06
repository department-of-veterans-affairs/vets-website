import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import mockMPIErrorUser from '~/applications/personalization/profile/tests/fixtures/users/user-mpi-error.json';

describe('MyVA Dashboard', () => {
  describe('when there is an error connecting to MPI', () => {
    beforeEach(() => {
      mockLocalStorage();

      cy.login(mockMPIErrorUser);
    });
    it('should show an MPI error in place of the claims/appeals and health care sections', () => {
      cy.visit('my-va/');

      cy.findByRole('heading', {
        name: /We can’t access your records right now/i,
      }).should('exist');
      cy.findByText(
        /Something went wrong when we tried to connect to your records. Please refresh this page or try again later/i,
      ).should('exist');
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByTestId('dashboard-section-claims-and-appeals').should(
        'not.exist',
      );

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
