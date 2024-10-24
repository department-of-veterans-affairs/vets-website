import mockUser from '../fixtures/user.json';
import vamc from '../fixtures/facilities/vamc-ehr.json';

// import mockNonMRuser from '../fixtures/non_mr_user.json';
// import mockNonMhvUser from '../fixtures/user-mhv-account-state-none.json';

class MedicalRecordsSite {
  login = (userFixture = mockUser, isAccelerating = false) => {
    this.mockFeatureToggles(isAccelerating);
    this.mockVamcEhr();
    this.mockMaintenanceWindow();
    cy.login(userFixture);
    // src/platform/testing/e2e/cypress/support/commands/login.js handles the next two lines
    // window.localStorage.setItem('isLoggedIn', true);
    // cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
  };

  mockFeatureToggles = (isAccelerating = false) => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_integration_medical_records_to_phase_1',
            value: true,
          },
          {
            name: 'mhv_accelerated_delivery_allergies_enabled',
            value: isAccelerating,
          },
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
          {
            name: 'mhv_medical_records_display_notes',
            value: true,
          },
          {
            name: 'mhv_medical_records_display_conditions',
            value: true,
          },
          {
            name: 'mhv_medical_records_display_vitals',
            value: true,
          },
          {
            name: 'mhv_medical_records_display_labs_and_tests',
            value: true,
          },
          {
            name: 'mhv_medical_records_display_settings_page',
            value: true,
          },
          {
            name: 'mhvMedicalRecordsDisplaySidenav',
            value: true,
          },
          {
            name: 'mhv_medical_records_display_sidenav',
            value: true,
          },
        ],
      },
    }).as('featureToggles');
  };

  mockVamcEhr = () => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamc).as('vamcEhr');
  };

  mockMaintenanceWindow = () => {
    cy.intercept('GET', '/v0/maintenance_windows', {}).as('maintenanceWindow');
  };

  verifyDownloadedPdfFile = (_prefixString, _clickMoment, _searchText) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      const txtPath2 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      const txtPath3 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.pdf`;
      this.internalReadFileMaybe(txtPath1, _searchText);
      this.internalReadFileMaybe(txtPath2, _searchText);
      this.internalReadFileMaybe(txtPath3, _searchText);
    } else {
      cy.log('browser is not headless');
    }
  };

  verifyDownloadedTxtFile = (_prefixString, _clickMoment, _searchText) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.txt`;
      const txtPath2 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.txt`;
      const txtPath3 = `${downloadsFolder}/${_prefixString}-${_clickMoment
        .add(1, 'seconds')
        .format('M-D-YYYY_hhmmssa')}.txt`;
      this.internalReadFileMaybe(txtPath1, _searchText);
      this.internalReadFileMaybe(txtPath2, _searchText);
      this.internalReadFileMaybe(txtPath3, _searchText);
    } else {
      cy.log('browser is not headless');
    }
  };

  internalReadFileMaybe = (fileName, searchText) => {
    cy.task('log', `attempting to find file = ${fileName}`);
    cy.task('readFileMaybe', fileName).then(textOrNull => {
      if (textOrNull == null) {
        cy.task('log', `found the file ${fileName} but did not find text`);
      } else {
        cy.task('log', `found the text in ${fileName}`);
        cy.readFile(fileName).should('contain', `${searchText}`);
      }
    });
  };

  loadPage = () => {
    cy.visit('my-health/medical-records');
    cy.wait('@mockUser');
  };
}
export default MedicalRecordsSite;
