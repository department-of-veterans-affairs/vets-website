import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks, mockItf } from './cypress.helpers';
import migrations from '../migrations';
import { MOCK_SIPS_API } from '../constants';

Cypress.config('waitForAnimations', true);

/** @constant {string} RETURN_URL - Save-in-progress returnUrl that navigates to the evidence request page on form load */
const RETURN_URL = '/supporting-evidence/evidence-request';

/**
 * Builds feature toggle payload with the enhancement flag ON and the
 * FileInputV3 flag set to the given value.
 *
 * When `v3Enabled` is `true` the form renders `va-file-input-multiple`
 * (V0 pages); when `false` it falls back to the legacy FileField upload
 * component (V1 pages).
 *
 * @param {Object} options
 * @param {boolean} [options.v3Enabled=false] - Whether the FileInputV3 toggle is enabled
 * @returns {Object} Feature toggle response payload
 */
const createToggles = ({ v3Enabled = false } = {}) => ({
  data: {
    type: 'feature_toggles',
    features: [
      ...mockFeatureToggles.data.features.filter(
        f =>
          f.name !== 'disability_526_supporting_evidence_enhancement' &&
          f.name !== 'disability_526_supporting_evidence_file_input_v3' &&
          f.name !== 'disability_526_form4142_use_2024_version',
      ),
      {
        name: 'disability_526_supporting_evidence_enhancement',
        value: true,
      },
      {
        name: 'disability_526_supporting_evidence_file_input_v3',
        value: v3Enabled,
      },
      {
        name: 'disability_526_form4142_use_2024_version',
        value: true,
      },
    ],
  },
});

/**
 * Routing scenarios covered by data sets:
 *
 * - **no-evidence** -
 *   Orientation => Evidence Request (No) => Additional Evidence Intro (No)
 *   => Summary (no evidence warning)
 *
 * - **va-only** -
 *   Orientation => Evidence Request (Yes) => Medical Records (VA checked)
 *   => VA Medical Records => Additional Evidence Intro (No) => Summary
 *
 * - **full-path** -
 *   Orientation => Evidence Request (Yes)
 *   => Medical Records (VA + Private checked) => VA Medical Records
 *   => Private Medical Records (upload) => Private Records Upload Enhancement
 *   => Additional Evidence Intro (Yes) => Additional Evidence Upload => Summary
 *
 * - **private-upload** -
 *   Orientation => Evidence Request (Yes) => Medical Records (Private only)
 *   => Private Medical Records (upload) => Private Records Upload Enhancement
 *   => Additional Evidence Intro (No) => Summary
 *
 * - **additional-docs-only** -
 *   Orientation => Evidence Request (No) => Additional Evidence Intro (Yes)
 *   => Additional Evidence Upload => Summary
 *
 * - **4142-provider** -
 *   Orientation => Evidence Request (Yes) => Medical Records (Private only)
 *   => Private Medical Records (VA to retrieve) => Auth Page
 *   => Provider Release => Additional Evidence Intro (No) => Summary
 *
 * Each scenario runs twice: once with FileInputV3 ON (V0 pages using
 * `va-file-input-multiple`) and once with FileInputV3 OFF (V1 pages using
 * legacy FileField).
 */

/**
 * Creates a form-tester config for the supporting evidence enhancement flow.
 *
 * @param {Object} options
 * @param {boolean} options.v3Enabled - Whether the FileInputV3 toggle is enabled
 * @returns {Object} Form tester configuration object
 */
const createEnhancementTestConfig = ({ v3Enabled }) => {
  const toggles = createToggles({ v3Enabled });
  const v3Label = v3Enabled ? 'FileInputV3 ON' : 'FileInputV3 OFF';

  return createTestConfig(
    {
      appName: `${manifest.appName} - Evidence Enhancement (${v3Label})`,

      dataPrefix: 'data',
      useWebComponentFields: true,

      dataSets: [
        'no-evidence',
        'va-only',
        'full-path',
        'private-upload',
        'additional-docs-only',
        '4142-provider',
      ],

      fixtures: {
        data: path.join(
          __dirname,
          'fixtures',
          'data',
          '0781-evidence-enhancement',
        ),
      },

      pageHooks: {
        ...pageHooks(cy),

        /**
         * Introduction page hook - clicks "Start the application" and waits
         * for the SIPS returnUrl redirect to the evidence-request page.
         */
        introduction: () => {
          cy.findAllByText(/start the/i, { selector: 'a' })
            .first()
            .click();
          cy.url().should('include', 'supporting-evidence/evidence-request');
        },

        /**
         * Evidence Request page hook - dismisses the ITF interstitial, then
         * fills the custom VaRadio Yes/No based on test data.
         */
        'supporting-evidence/evidence-request': () => {
          cy.get('.itf-wrapper')
            .should('be.visible')
            .then(() => {
              cy.findByText(/continue/i, { selector: 'button' }).click();
            });

          cy.get('@testData').then(data => {
            const hasMedicalRecords = data['view:hasMedicalRecords'];
            cy.get(
              `va-radio-option[label="${hasMedicalRecords ? 'Yes' : 'No'}"]`,
            ).click();
          });
        },

        /**
         * Medical Records page hook - checks VA and/or Private medical
         * records checkboxes based on test data.
         */
        'supporting-evidence/medical-records': () => {
          cy.get('@testData').then(data => {
            const types = data['view:selectableEvidenceTypes'] || {};

            if (types['view:hasVaMedicalRecords']) {
              cy.get('va-checkbox[value="view:hasVaMedicalRecords"]')
                .shadow()
                .find('input')
                .click({ force: true });
            }

            if (types['view:hasPrivateMedicalRecords']) {
              cy.get('va-checkbox[value="view:hasPrivateMedicalRecords"]')
                .shadow()
                .find('input')
                .click({ force: true });
            }
          });
        },

        /**
         * Private Medical Records Upload (V0) page hook - uploads a test file
         * via `va-file-input-multiple` and selects a document type.
         */
        'supporting-evidence/private-medical-records-upload-enhancement': () => {
          cy.get('va-file-input-multiple')
            .shadow()
            .find('input[type="file"]')
            .selectFile(
              {
                contents: Cypress.Buffer.from('test content'),
                fileName: 'test-document.txt',
                mimeType: 'text/plain',
              },
              { force: true },
            );

          cy.wait('@uploadFile');

          cy.get('va-select[name="attachmentId"]')
            .shadow()
            .find('select')
            .first()
            .should('not.be.disabled')
            .select('L049');
        },

        /**
         * Additional Evidence Upload (V0) page hook - uploads a test file
         * via `va-file-input-multiple` and selects a document type.
         */
        'supporting-evidence/additional-evidence-enhancement': () => {
          cy.get('va-file-input-multiple')
            .shadow()
            .find('input[type="file"]')
            .selectFile(
              {
                contents: Cypress.Buffer.from('test content'),
                fileName: 'test-evidence.txt',
                mimeType: 'text/plain',
              },
              { force: true },
            );

          cy.wait('@uploadFile');

          cy.get('va-select[name="docType"]')
            .shadow()
            .find('select')
            .first()
            .should('not.be.disabled')
            .select('L023');
        },

        /**
         * Additional Evidence Intro page hook - selects Yes/No on the
         * VaRadio based on whether test data has other evidence.
         */
        'supporting-evidence/additional-evidence-intro': () => {
          cy.get('@testData').then(data => {
            const hasAdditionalEvidence =
              data['view:selectableEvidenceTypes']['view:hasOtherEvidence'];
            cy.get(
              `va-radio-option[label="${
                hasAdditionalEvidence ? 'Yes' : 'No'
              }"]`,
            ).click();
          });
        },
      },

      setupPerTest: () => {
        cy.intercept('GET', '/v0/feature_toggles*', toggles);
        cy.login(mockUser);
        setup(cy, { toggles });

        cy.intercept('GET', '/v0/intent_to_file', mockItf());
        cy.intercept('POST', '/v0/intent_to_file/compensation', mockItf());

        /**
         * Override the SIPS GET response to set `returnUrl` so
         * `onFormLoaded` navigates to supporting evidence, and include
         * enhancement toggle flags in `formData` for `depends` functions.
         */
        cy.get('@testData').then(data => {
          cy.intercept('GET', `${MOCK_SIPS_API}*`, {
            formData: {
              ...mockPrefill.formData,
              disabilities: data.ratedDisabilities,
              servicePeriods: data.serviceInformation.servicePeriods,
              reservesNationalGuardService:
                data.serviceInformation.reservesNationalGuardService,
              veteran: {
                ...mockPrefill.formData.veteran,
                mailingAddress: data.mailingAddress,
              },
              'view:claimType': data['view:claimType'],
              disability526SupportingEvidenceEnhancement: true,
              disability526SupportingEvidenceFileInputV3: v3Enabled,
              ...(data.vaTreatmentFacilities && {
                vaTreatmentFacilities: data.vaTreatmentFacilities,
              }),
              ...(data.providerFacility && {
                providerFacility: data.providerFacility,
              }),
              ...(data.newDisabilities?.length && {
                newDisabilities: data.newDisabilities,
              }),
              ...(data.disability526Enable2024Form4142 && {
                disability526Enable2024Form4142: true,
              }),
            },
            metadata: {
              ...mockPrefill.metadata,
              version: migrations.length,
              returnUrl: RETURN_URL,
            },
          });
        });
      },

      stopTestAfterPath: 'supporting-evidence/summary',

      // Bypass known nested definition list a11y issue in ChapterSectionCollection
      _13647Exception: true,
    },
    manifest,
    formConfig,
  );
};

/** V1 path - legacy FileField upload pages (FileInputV3 OFF) */
testForm(createEnhancementTestConfig({ v3Enabled: false }));

/** V0 path - va-file-input-multiple upload pages (FileInputV3 ON) */
testForm(createEnhancementTestConfig({ v3Enabled: true }));
