import mockUser from '../../fixtures/user.json';

class MedicalRecordsSite {
  login = (isMRUser = true) => {
    if (isMRUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      //   cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      //   cy.intercept('GET', '/v0/user_transition_availabilities', mockUser);
      //   cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'mhv_secure_messaging_to_va_gov_release',
              value: true,
            },
          ],
        },
      }).as('featureToggle');
    }
  };
}
export default MedicalRecordsSite;
