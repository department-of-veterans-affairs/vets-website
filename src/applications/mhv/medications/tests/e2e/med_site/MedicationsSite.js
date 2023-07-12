import mockUser from '../fixtures/user.json';
import vamcUser from '../fixtures/vamc-ehr.json';

import prescriptions from '../fixtures/prescriptions.json';

class MedicationsSite {
  login = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'mhv_medications_to_va_gov_release',
              value: true,
            },
          ],
        },
      }).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?page=1&per_page=999',
        prescriptions,
      ).as('prescriptions');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
    }
  };

  loadVAPaginationPrescriptions = (
    interceptedPage = 1,
    mockRx,
    PerPage = 10,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?page=1&per_page=${PerPage}`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[aria-label="Pagination"]')
      .shadow()
      .find(`[aria-label="Page ${interceptedPage}"]`)
      .click();
    cy.wait(`@Prescriptions${interceptedPage}`);
  };

  loadVAPaginationNextPrescriptions = (interceptedPage = 1, mockRx) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?page=1&per_page=999`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[aria-label="Pagination"]')
      .shadow()
      .find('[aria-label="Next page"]')
      .click();
    cy.wait(`@Prescriptions${interceptedPage}`);
  };
}
export default MedicationsSite;
