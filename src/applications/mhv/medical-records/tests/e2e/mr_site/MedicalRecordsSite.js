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
              name: 'mhvMedicalRecordsPhrRefreshOnLogin',
              value: false,
            },
            {
              name: 'mhv_medical_records_phr_refresh_on_login',
              value: false,
            },
            {
              name: 'mhvMedicalRecordsToVAGovRelease',
              value: true,
            },
            {
              name: 'mhv_medical_records_to_va_gov_release',
              value: true,
            },
            {
              name: 'mhvMedicalRecordsDisplayDomains',
              value: true,
            },
            {
              name: 'mhv_medical_records_display_domains',
              value: true,
            },
            {
              name: 'mhv_medical_records_allow_txt_downloads',
              value: true,
            },
            {
              name: 'mhv_medical_records_display_vaccines',
              value: true,
            },
          ],
        },
      }).as('featureToggle');
    }
  };
}
export default MedicalRecordsSite;
