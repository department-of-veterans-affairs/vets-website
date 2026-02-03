/**
 * @module config/form
 * @description Main form configuration for VA Form 21-2680 - Examination for Housebound Status
 * or Permanent Need for Regular Aid & Attendance
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  TITLE,
  SUBTITLE,
  API_ENDPOINTS,
} from '@bio-aquia/21-2680-house-bound-status/constants';
import {
  GetHelp,
  preSubmitSignatureConfig,
} from '@bio-aquia/21-2680-house-bound-status/components';
import migrations from '@bio-aquia/21-2680-house-bound-status/config/migrations';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status/containers/confirmation-page';
import { submitTransformer } from '@bio-aquia/21-2680-house-bound-status/config/submit-transformer';
import manifest from '@bio-aquia/21-2680-house-bound-status/manifest.json';

// Import page configurations (uiSchema and schema)
import {
  veteranInformationUiSchema,
  veteranInformationSchema,
  veteranSsnUiSchema,
  veteranSsnSchema,
  veteranAddressUiSchema,
  veteranAddressSchema,
  claimantRelationshipUiSchema,
  claimantRelationshipSchema,
  claimantInformationUiSchema,
  claimantInformationSchema,
  claimantSsnUiSchema,
  claimantSsnSchema,
  claimantAddressUiSchema,
  claimantAddressSchema,
  claimantContactUiSchema,
  claimantContactSchema,
  benefitTypeUiSchema,
  benefitTypeSchema,
  hospitalizationStatusUiSchema,
  hospitalizationStatusSchema,
  hospitalizationDateUiSchema,
  hospitalizationDateSchema,
  hospitalizationFacilityUiSchema,
  hospitalizationFacilitySchema,
} from '@bio-aquia/21-2680-house-bound-status/pages';

import { isClaimantVeteran } from '@bio-aquia/21-2680-house-bound-status/utils/relationship-helpers';
import {
  getVeteranName,
  getClaimantName,
} from '@bio-aquia/21-2680-house-bound-status/utils/name-helpers';

/**
 * @typedef {Object} FormConfig
 * @property {string} rootUrl - Base URL for the form
 * @property {string} urlPrefix - URL prefix for form pages
 * @property {string} submitUrl - API endpoint for form submission
 * @property {Function} submit - Form submission handler
 * @property {string} trackingPrefix - Analytics tracking prefix
 * @property {React.Component} introduction - Introduction page component
 * @property {React.Component} confirmation - Confirmation page component
 * @property {Object} dev - Development settings
 * @property {string} formId - Unique form identifier
 * @property {Object} saveInProgress - Save-in-progress configuration
 * @property {number} version - Form version number
 * @property {boolean} prefillEnabled - Enable prefilling from user profile
 * @property {Object} savedFormMessages - Custom messages for saved forms
 * @property {string} title - Form title
 * @property {string} subTitle - Form subtitle
 * @property {Object} defaultDefinitions - Default schema definitions
 * @property {Object} chapters - Form chapters configuration
 * @property {React.Component|string} footerContent - Footer content component
 */

/**
 * Main form configuration object for VA Form 21-2680
 * @type {FormConfig}
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: API_ENDPOINTS.submitForm,
  transformForSubmit: submitTransformer,
  trackingPrefix: '21-2680-house-bound-status-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelp,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_2680,
  saveInProgress: {
    messages: {
      inProgress: 'Your benefits application (21-2680) is in progress.',
      expired:
        'Your saved benefits application (21-2680) has expired. If you want to apply for benefits, please start a new application.',
      saved: 'Your benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  migrations,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    // Step 1 of 5: Veteran's information
    veteranInformationChapter: {
      title: "Veteran's information",
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: "Veteran's information",
          uiSchema: veteranInformationUiSchema,
          schema: veteranInformationSchema,
        },
        veteranSsn: {
          path: 'veteran-ssn',
          title: "Veteran's Social Security number",
          uiSchema: veteranSsnUiSchema,
          schema: veteranSsnSchema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran address',
          uiSchema: veteranAddressUiSchema,
          schema: veteranAddressSchema,
        },
      },
    },

    // Step 2 of 5: Claimant's information
    claimantInformationChapter: {
      title: "Claimant's information",
      pages: {
        claimantRelationship: {
          path: 'claimant-relationship',
          title: 'Who is the claim for?',
          uiSchema: claimantRelationshipUiSchema,
          schema: claimantRelationshipSchema,
        },
        claimantInformation: {
          path: 'claimant-information',
          title: formData => {
            const relationshipLabels = {
              spouse: "Veteran's spouse's information",
              child: "Veteran's child's information",
              parent: "Veteran's parent's information",
            };
            const relationship = formData?.claimantRelationship?.relationship;
            return relationshipLabels[relationship] || 'Claimant information';
          },
          uiSchema: claimantInformationUiSchema,
          schema: claimantInformationSchema,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.relationship !== 'veteran',
        },
        claimantSSN: {
          path: 'claimant-ssn',
          title: formData => {
            const firstName =
              formData?.claimantInformation?.claimantFullName?.first || '';
            const lastName =
              formData?.claimantInformation?.claimantFullName?.last || '';
            const fullName = `${firstName} ${lastName}`.trim();
            return fullName
              ? `${fullName}'s Social Security number`
              : "Claimant's Social Security number";
          },
          uiSchema: claimantSsnUiSchema,
          schema: claimantSsnSchema,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.relationship !== 'veteran',
        },
        claimantAddress: {
          path: 'claimant-address',
          title: formData => {
            const firstName =
              formData?.claimantInformation?.claimantFullName?.first || '';
            const lastName =
              formData?.claimantInformation?.claimantFullName?.last || '';
            const fullName = `${firstName} ${lastName}`.trim();
            return fullName ? `${fullName}'s address` : "Claimant's address";
          },
          uiSchema: claimantAddressUiSchema,
          schema: claimantAddressSchema,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.relationship !== 'veteran',
        },
        claimantContact: {
          path: 'claimant-contact',
          title: formData => {
            const isVeteran = isClaimantVeteran(formData);
            const fullName = isVeteran
              ? getVeteranName(formData, '')
              : getClaimantName(formData, '');
            const fallback = isVeteran ? "Veteran's" : "Claimant's";
            return fullName
              ? `${fullName}'s phone number and email address`
              : `${fallback} phone number and email address`;
          },
          uiSchema: claimantContactUiSchema,
          schema: claimantContactSchema,
          // Always shown - collects contact info for veteran or claimant
        },
      },
    },

    // Step 3 of 5: Claim information
    claimInformationChapter: {
      title: 'Claim information',
      pages: {
        benefitType: {
          path: 'benefit-type',
          title: 'Choose your benefit type',
          uiSchema: benefitTypeUiSchema,
          schema: benefitTypeSchema,
        },
      },
    },

    // Step 4 of 5: Hospitalization
    hospitalizationChapter: {
      title: 'Hospitalization',
      pages: {
        hospitalizationStatus: {
          path: 'hospitalization-status',
          title: formData => {
            const isVeteran =
              formData?.claimantRelationship?.relationship === 'veteran';

            if (isVeteran) {
              const firstName =
                formData?.veteranInformation?.veteranFullName?.first || '';
              const lastName =
                formData?.veteranInformation?.veteranFullName?.last || '';
              const fullName = `${firstName} ${lastName}`.trim();

              if (fullName) {
                return `Is ${fullName} hospitalized?`;
              }
              return 'Is the Veteran hospitalized?';
            }

            const firstName =
              formData?.claimantInformation?.claimantFullName?.first || '';
            const lastName =
              formData?.claimantInformation?.claimantFullName?.last || '';
            const fullName = `${firstName} ${lastName}`.trim();

            if (fullName) {
              return `Is ${fullName} hospitalized?`;
            }
            return 'Is the claimant hospitalized?';
          },
          uiSchema: hospitalizationStatusUiSchema,
          schema: hospitalizationStatusSchema,
        },
        hospitalizationDate: {
          path: 'hospitalization-date',
          title: formData => {
            const isVeteran =
              formData?.claimantRelationship?.relationship === 'veteran';

            if (isVeteran) {
              const firstName =
                formData?.veteranInformation?.veteranFullName?.first || '';
              const lastName =
                formData?.veteranInformation?.veteranFullName?.last || '';
              const fullName = `${firstName} ${lastName}`.trim();

              if (fullName) {
                return `When was ${fullName} admitted to the hospital?`;
              }
              return 'When were you admitted to the hospital?';
            }

            const firstName =
              formData?.claimantInformation?.claimantFullName?.first || '';
            const lastName =
              formData?.claimantInformation?.claimantFullName?.last || '';
            const fullName = `${firstName} ${lastName}`.trim();

            if (fullName) {
              return `When was ${fullName} admitted to the hospital?`;
            }
            return 'When was the claimant admitted to the hospital?';
          },
          uiSchema: hospitalizationDateUiSchema,
          schema: hospitalizationDateSchema,
          depends: formData =>
            formData?.hospitalizationStatus?.isCurrentlyHospitalized === true,
        },
        hospitalizationFacility: {
          path: 'hospitalization-facility',
          title: formData => {
            const isVeteran =
              formData?.claimantRelationship?.relationship === 'veteran';

            if (isVeteran) {
              const firstName =
                formData?.veteranInformation?.veteranFullName?.first || '';
              const lastName =
                formData?.veteranInformation?.veteranFullName?.last || '';
              const fullName = `${firstName} ${lastName}`.trim();

              if (fullName) {
                return `What's the name and address of the hospital where ${fullName} is admitted?`;
              }
              return "What's the name and address of the hospital where the claimant is admitted?";
            }

            const firstName =
              formData?.claimantInformation?.claimantFullName?.first || '';
            const lastName =
              formData?.claimantInformation?.claimantFullName?.last || '';
            const fullName = `${firstName} ${lastName}`.trim();

            if (fullName) {
              return `What's the name and address of the hospital where ${fullName} is admitted?`;
            }
            return "What's the name and address of the hospital where the claimant is admitted?";
          },
          uiSchema: hospitalizationFacilityUiSchema,
          schema: hospitalizationFacilitySchema,
          depends: formData =>
            formData?.hospitalizationStatus?.isCurrentlyHospitalized === true,
        },
      },
    },
  },
  preSubmitInfo: preSubmitSignatureConfig,
};

export { formConfig };
export default formConfig;
