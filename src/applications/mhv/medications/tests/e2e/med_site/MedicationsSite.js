import mockUser from '../fixtures/user.json';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockStatus from '../fixtures/profile-status.json';

class MedicationsSite {
  login = (isMedicationsUser = true) => {
    if (isMedicationsUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/v0/profile/status', mockStatus);
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
    }
  };
}
export default MedicationsSite;
