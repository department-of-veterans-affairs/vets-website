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

const RETURN_URL = '/supporting-evidence/evidence-request';

// Build feature toggles with the enhancement flag ON and the V3 file input
// flag set to the given value. When v3Enabled is true the form renders
// va-file-input-multiple (V0 pages); when false it falls back to the legacy
// FileField upload component (V1 pages).
const createToggles = ({ v3Enabled = false } = {}) => ({
  data: {
    type: 'feature_toggles',
    features: [
      ...mockFeatureToggles.data.features.filter(
        f =>
          f.name !== 'disability_526_supporting_evidence_enhancement' &&
          f.name !== 'disability_526_supporting_evidence_file_input_v3',
      ),
      {
        name: 'disability_526_supporting_evidence_enhancement',
        value: true,
      },
      {
        name: 'disability_526_supporting_evidence_file_input_v3',
        value: v3Enabled,
      },
    ],
  },
});

// Routing scenarios covered by data sets:
//
// evidence-enhancement-no-evidence:
//   Orientation -> Evidence Request (No) -> Additional Evidence Intro (No)
//   -> Summary (no evidence warning)
//
// evidence-enhancement-va-only:
//   Orientation -> Evidence Request (Yes) -> Medical Records (VA checked)
//   -> VA Medical Records -> Additional Evidence Intro (No) -> Summary
//
// evidence-enhancement-full-path:
//   Orientation -> Evidence Request (Yes)
//   -> Medical Records (VA + Private checked) -> VA Medical Records
//   -> Private Medical Records (upload) -> Private Records Upload Enhancement
//   -> Additional Evidence Intro (Yes) -> Additional Evidence Upload -> Summary
//
// Each scenario runs twice: once with FileInputV3 ON (V0 pages using
// va-file-input-multiple) and once with FileInputV3 OFF (V1 pages using
// legacy FileField).

const createEnhancementTestConfig = ({ v3Enabled }) => {
  const toggles = createToggles({ v3Enabled });
  const v3Label = v3Enabled ? 'FileInputV3 ON' : 'FileInputV3 OFF';

  return createTestConfig(
    {
      appName: `${manifest.appName} - Evidence Enhancement (${v3Label})`,

      dataPrefix: 'data',
      useWebComponentFields: true,

      dataSets: [
        'evidence-enhancement-no-evidence',
        'evidence-enhancement-va-only',
        'evidence-enhancement-full-path',
      ],

      fixtures: {
        data: path.join(__dirname, 'fixtures', 'data'),
      },

      pageHooks: {
        ...pageHooks(cy),

        // Override the shared introduction hook so that after clicking
        // "Start the application" we wait for the SIPS returnUrl redirect
        // to land on the evidence-request page before processPage continues.
        introduction: () => {
          cy.findAllByText(/start the/i, { selector: 'a' })
            .first()
            .click();
          cy.url().should('include', 'supporting-evidence/evidence-request');
        },

        // Evidence Request — dismiss ITF interstitial then fill custom
        // VaRadio Yes/No. The form-tester's default post hook handles
        // page navigation via clickFormContinue().
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

        // Medical Records — custom page with VaCheckboxGroup
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

        // Private Medical Records Upload (V0) — va-file-input-multiple
        // requires uploading a file and selecting a document type.
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

          // Select document type from PMR dropdown
          cy.get('va-select[name="attachmentId"]')
            .shadow()
            .find('select')
            .first()
            .select('L049');
        },

        // Additional Evidence Upload (V0) — va-file-input-multiple
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

          // Select document type from additional evidence dropdown
          cy.get('va-select[name="docType"]')
            .shadow()
            .find('select')
            .first()
            .select('L023');
        },

        // Additional Evidence Intro — custom page with VaRadio Yes/No
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

        // Override the broken ITF mock from setup (which passes the function
        // reference instead of calling it) with a proper static response
        cy.intercept('GET', '/v0/intent_to_file', mockItf());
        cy.intercept('POST', '/v0/intent_to_file/compensation', mockItf());

        // Override the SIPS GET response (after setup) to:
        // 1. Set returnUrl so onFormLoaded navigates to supporting evidence
        // 2. Include enhancement toggle flags in formData for depends functions
        cy.get('@testData').then(data => {
          // Pass ratedDisabilities as disabilities WITH view:selected so the
          // prefillTransformer preserves the selection flag into
          // ratedDisabilities. This is needed for makeSchemaForAllDisabilities
          // to generate treatedDisabilityNames checkboxes on the
          // va-medical-records page.
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
            },
            metadata: {
              ...mockPrefill.metadata,
              version: migrations.length,
              returnUrl: RETURN_URL,
            },
          });
        });
      },

      // Stop after summary — only test supporting evidence chapter
      stopTestAfterPath: 'supporting-evidence/summary',

      // Bypass known nested definition list a11y issue in ChapterSectionCollection
      _13647Exception: true,
    },
    manifest,
    formConfig,
  );
};

// V1 path — legacy FileField upload pages (FileInputV3 OFF)
testForm(createEnhancementTestConfig({ v3Enabled: false }));

// V0 path — va-file-input-multiple upload pages (FileInputV3 ON)
testForm(createEnhancementTestConfig({ v3Enabled: true }));
