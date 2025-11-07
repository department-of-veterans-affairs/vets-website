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
} from '@bio-aquia/21-2680-house-bound-status/constants';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status/containers/confirmation-page';
import { GetHelp } from '@bio-aquia/21-2680-house-bound-status/components/get-help';
import PreSubmitInfo from '@bio-aquia/21-2680-house-bound-status/components/pre-submit-info';
import manifest from '@bio-aquia/21-2680-house-bound-status/manifest.json';
import { prefillTransformer } from '@bio-aquia/21-2680-house-bound-status/config/prefill-transformer';
import { submitTransformer } from '@bio-aquia/21-2680-house-bound-status/config/submit-transformer';

// Import all page components from barrel export
import {
  BenefitTypePage,
  VeteranIdentityPage,
  VeteranAddressPage,
  ClaimantRelationshipPage,
  ClaimantInformationPage,
  ClaimantSSNPage,
  ClaimantAddressPage,
  ClaimantContactPage,
  HospitalizationStatusPage,
  HospitalizationDatePage,
  HospitalizationFacilityPage,
  BenefitTypeReviewPage,
  VeteranIdentityReviewPage,
  VeteranAddressReviewPage,
  ClaimantInformationReviewPage,
  HospitalizationStatusReviewPage,
  HospitalizationDateReviewPage,
  HospitalizationFacilityReviewPage,
} from '@bio-aquia/21-2680-house-bound-status/pages';

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
  submitUrl: '/simple_forms_api/v1/simple_forms',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-2680-house-bound-status-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit: submitTransformer,
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
        veteranIdentity: {
          path: 'veteran-information',
          title: 'Veteran information',
          CustomPage: VeteranIdentityPage,
          CustomPageReview: VeteranIdentityReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran address',
          CustomPage: VeteranAddressPage,
          CustomPageReview: VeteranAddressReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
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
          CustomPage: ClaimantRelationshipPage,
          // Show comprehensive review with all claimant fields - edit navigates to first claimant page
          CustomPageReview: ClaimantInformationReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant information',
          CustomPage: ClaimantInformationPage,
          // Hidden page - user edits this via claimant-relationship review section
          CustomPageReview: () => null,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.claimantRelationship !== 'veteran',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        claimantSSN: {
          path: 'claimant-ssn',
          title: 'Claimant Social Security number',
          CustomPage: ClaimantSSNPage,
          // Hidden page - user edits this via claimant-relationship review section
          CustomPageReview: () => null,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.claimantRelationship !== 'veteran',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        claimantAddress: {
          path: 'claimant-address',
          title: 'Claimant address',
          CustomPage: ClaimantAddressPage,
          // Hidden page - user edits this via claimant-relationship review section
          CustomPageReview: () => null,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.claimantRelationship !== 'veteran',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        claimantContact: {
          path: 'claimant-contact',
          title: 'Contact information',
          CustomPage: ClaimantContactPage,
          // Hidden page - user edits this via claimant-relationship review section
          CustomPageReview: () => null,
          // Hidden when veteran is claimant
          depends: formData =>
            formData?.claimantRelationship?.claimantRelationship !== 'veteran',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
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
          CustomPage: BenefitTypePage,
          CustomPageReview: BenefitTypeReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    // Step 4 of 5: Hospitalization
    hospitalizationChapter: {
      title: 'Hospitalization',
      pages: {
        hospitalizationStatus: {
          path: 'hospitalization-status',
          title: 'Hospitalization status',
          CustomPage: HospitalizationStatusPage,
          CustomPageReview: HospitalizationStatusReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        hospitalizationDate: {
          path: 'hospitalization-date',
          title: 'Admission date',
          CustomPage: HospitalizationDatePage,
          CustomPageReview: HospitalizationDateReviewPage,
          depends: formData =>
            formData?.hospitalizationStatus?.isCurrentlyHospitalized === 'yes',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        hospitalizationFacility: {
          path: 'hospitalization-facility',
          title: 'Hospital information',
          CustomPage: HospitalizationFacilityPage,
          CustomPageReview: HospitalizationFacilityReviewPage,
          depends: formData =>
            formData?.hospitalizationStatus?.isCurrentlyHospitalized === 'yes',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
  preSubmitInfo: PreSubmitInfo,
  getHelp: GetHelp,
  footerContent,
};

export { formConfig };
