import mockUser from '../fixtures/user.json';

class MedicalRecordsSite {
  login = (isMRUser = true) => {
    if (isMRUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'mhv_medical_records_to_va_gov_release',
              value: true,
            },
          ],
        },
      }).as('featureToggle');
    }
  };
}
export default MedicalRecordsSite;
