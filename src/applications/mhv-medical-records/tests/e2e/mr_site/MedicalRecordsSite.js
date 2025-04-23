import mockUser from '../fixtures/user.json';
import vamc from '../fixtures/facilities/vamc-ehr.json';
import sessionStatus from '../fixtures/session-status.json';
// import mockNonMRuser from '../fixtures/non_mr_user.json';
// import mockNonMhvUser from '../fixtures/user-mhv-account-state-none.json';

class MedicalRecordsSite {
  login = (userFixture = mockUser, useDefaultFeatureToggles = true) => {
    if (useDefaultFeatureToggles) {
      this.mockFeatureToggles();
    }
    this.mockVamcEhr();
    this.mockMaintenanceWindow();
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
    cy.login(userFixture);
  };

  mockFeatureToggles = ({
    isAcceleratingEnabled = false,
    isAcceleratingAllergies = false,
    isAcceleratingVitals = false,
  } = {}) => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_accelerated_delivery_enabled',
            value: isAcceleratingEnabled,
          },
          {
            name: 'mhv_accelerated_delivery_allergies_enabled',
            value: isAcceleratingAllergies,
          },
          {
            name: 'mhv_accelerated_delivery_vital_signs_enabled',
            value: isAcceleratingVitals,
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
