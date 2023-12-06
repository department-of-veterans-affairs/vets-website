import mockUser from '../fixtures/user.json';
import vamcUser from '../fixtures/vamc-ehr.json';

import prescriptions from '../fixtures/prescriptions.json';

class MedicationsSite {
  login = (isMedicationsUser = true, featureToggle = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);

      cy.intercept(
        { method: 'GET', url: '/v0/feature_toggles?*' },
        {
          data: {
            type: 'feature_toggles',
            features: [
              {
                name: 'mhv_medications_to_va_gov_release',
                value: featureToggle,
              },
            ],
          },
        },
      ).as('featureToggle');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept(
        'GET',
        '/my_health/v1/prescriptions?page=1&per_page=999',
        prescriptions,
      ).as('prescriptions');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/health-care/refill-track-prescriptions');
    }
  };

  loadVAPaginationPrescriptions = (interceptedPage = 1, mockRx) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?page=${interceptedPage}&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[id="pagination"]')
      .shadow()
      .find('[class="usa-pagination__button usa-current"]')
      .click({ waitForAnimations: true });
    // cy.wait(`@Prescriptions${interceptedPage}`);
  };

  loadVAPaginationNextPrescriptions = (interceptedPage = 2, mockRx) => {
    cy.intercept(
      'GET',
      `/my_health/v1/prescriptions?page=${interceptedPage}&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[id="pagination"]')
      .shadow()
      .find('[aria-label="Next page"]')
      .click({ waitForAnimations: true });
  };

  loadVAPaginationPreviousPrescriptions = (
    interceptedPage = 2,
    mockRx,
    PerPage = 10,
  ) => {
    cy.intercept(
      'POST',
      `/my_health/v1/prescriptions?page=1&per_page=${PerPage}`,
      mockRx,
    ).as(`Prescriptions${interceptedPage}`);
    cy.get('[id="pagination"]')
      .shadow()
      .find('[aria-label="Previous page"]')
      .click({ waitForAnimations: true });
    // cy.wait(`@Prescriptions${interceptedPage}`);
  };

  verifyPaginationPrescriptionsDisplayed = (
    displayedStartNumber,
    displayedEndNumber,
    threadLength,
  ) => {
    cy.get('[data-testid="page-total-info"]').should(
      'have.text',
      `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${threadLength} medications, last filled first`,
    );
  };
}
export default MedicationsSite;
