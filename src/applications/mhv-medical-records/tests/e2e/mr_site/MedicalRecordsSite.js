import mockUser from '../fixtures/user.json';
import vamc from '../fixtures/facilities/vamc-ehr.json';
import sessionStatus from '../fixtures/session-status.json';
import createAal from '../fixtures/create-aal.json';

class MedicalRecordsSite {
  login = (
    userFixture = mockUser,
    useDefaultFeatureToggles = true,
    featureToggleOptions = {},
  ) => {
    if (useDefaultFeatureToggles) {
      this.mockFeatureToggles(featureToggleOptions);
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
    cy.intercept('POST', '/my_health/v1/aal', {
      statusCode: 200,
      body: createAal,
    }).as('aal');
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.login(userFixture);
  };

  mockFeatureToggles = ({
    isAcceleratingEnabled = false,
    isAcceleratingAllergies = false,
    isAcceleratingVitals = false,
    isAcceleratingLabsAndTests = false,
    isAcceleratingCareNotes = false,
    isAcceleratingConditions = false,
    isAcceleratingVaccines = false,
    isCcdExtendedFileTypesEnabled = false,
    isCcdOHEnabled = false,
    isImagesDomainEnabled = false,
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
            name: 'mhv_accelerated_delivery_care_notes_enabled',
            value: isAcceleratingCareNotes,
          },
          {
            name: 'mhv_accelerated_delivery_vital_signs_enabled',
            value: isAcceleratingVitals,
          },
          {
            name: 'mhv_accelerated_delivery_labs_and_tests_enabled',
            value: isAcceleratingLabsAndTests,
          },
          {
            name: 'mhv_accelerated_delivery_conditions_enabled',
            value: isAcceleratingConditions,
          },
          {
            name: 'mhv_accelerated_delivery_vaccines_enabled',
            value: isAcceleratingVaccines,
          },
          {
            name: 'mhv_medical_records_ccd_extended_file_types',
            value: isCcdExtendedFileTypesEnabled,
          },
          {
            name: 'mhvMedicalRecordsCcdExtendedFileTypes',
            value: isCcdExtendedFileTypesEnabled,
          },
          {
            name: 'mhv_medical_records_ccd_oh',
            value: isCcdOHEnabled,
          },
          {
            name: 'mhvMedicalRecordsCcdOH',
            value: isCcdOHEnabled,
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
            name: 'mhv_medical_records_support_backend_pagination_allergy',
            value: false,
          },
          {
            name:
              'mhv_medical_records_support_backend_pagination_care_summary_note',
            value: false,
          },
          {
            name:
              'mhv_medical_records_support_backend_pagination_health_condition',
            value: false,
          },
          {
            name: 'mhv_medical_records_support_backend_pagination_lab_test',
            value: false,
          },
          {
            name: 'mhv_medical_records_support_backend_pagination_vaccine',
            value: false,
          },
          {
            name: 'mhv_medical_records_support_backend_pagination_vital',
            value: false,
          },
          {
            name: 'mhv_medical_records_images_domain',
            value: isImagesDomainEnabled,
          },
          {
            name: 'mhvMedicalRecordsImagesDomain',
            value: isImagesDomainEnabled,
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

  verifyDownloadedPdfFile = (_prefixString, _currentDateTime, _searchText) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.pdf`;
      const txtPath2 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.pdf`;
      const txtPath3 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.pdf`;
      this.internalReadFileMaybe(txtPath1, _searchText);
      this.internalReadFileMaybe(txtPath2, _searchText);
      this.internalReadFileMaybe(txtPath3, _searchText);
    } else {
      cy.log('browser is not headless');
    }
  };

  verifyDownloadedTxtFile = (_prefixString, _currentDateTime, _searchText) => {
    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.txt`;
      const txtPath2 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.txt`;
      const txtPath3 = `${downloadsFolder}/${_prefixString}-${_currentDateTime}.txt`;
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
    cy.wait(['@vamcEhr', '@mockUser', '@featureToggles', '@session']);
  };
}
export default MedicalRecordsSite;
