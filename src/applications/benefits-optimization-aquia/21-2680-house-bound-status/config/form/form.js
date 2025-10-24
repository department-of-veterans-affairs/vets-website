/**
 * @module config/form
 * @description Main form configuration for VA Form 21-2680 - Examination for Housebound Status
 * or Permanent Need for Regular Aid & Attendance
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status/constants';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status/containers/confirmation-page';
import { GetHelp } from '@bio-aquia/21-2680-house-bound-status/components/get-help';
import manifest from '@bio-aquia/21-2680-house-bound-status/manifest.json';
import prefillTransformer from '@bio-aquia/21-2680-house-bound-status/config/prefill-transformer';

// Import all page components from barrel export
import {
  BenefitTypePage,
  VeteranIdentityPage,
  ClaimantIdentityPage,
  HospitalizationPage,
  ClaimantSignaturePage,
  ExaminerIdentificationPage,
  MedicalDiagnosisPage,
  ADLAssessmentPage,
  FunctionalLimitationsPage,
  NarrativeAssessmentPage,
  ExaminerSignaturePage,
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
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-2680-house-bound-status-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions(),
  formId: VA_FORM_IDS.FORM_21_2680,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21-2680) is in progress.',
    //   expired: 'Your saved benefits application (21-2680) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    // Part 1: Benefit Selection
    benefitSelectionChapter: {
      title: 'Benefit selection',
      pages: {
        benefitType: {
          path: 'benefit-type',
          title: 'Choose your benefit type',
          CustomPage: BenefitTypePage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    // Part 2: Claimant Information (Sections I-V)
    veteranInformationChapter: {
      title: 'Section I - Veteran information',
      pages: {
        veteranIdentity: {
          path: 'veteran-identity',
          title: 'Veteran identification',
          CustomPage: VeteranIdentityPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    claimantInformationChapter: {
      title: 'Section II - Claimant information',
      pages: {
        claimantIdentity: {
          path: 'claimant-identity',
          title: 'Claimant identification',
          CustomPage: ClaimantIdentityPage,
          CustomPageReview: null,
          depends: formData => formData?.isVeteranClaimant === 'no',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    hospitalizationChapter: {
      title: 'Section IV - Hospitalization',
      pages: {
        hospitalization: {
          path: 'hospitalization',
          title: 'Current hospitalization',
          CustomPage: HospitalizationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    claimantSignatureChapter: {
      title: 'Section V - Claimant certification',
      pages: {
        claimantSignature: {
          path: 'claimant-signature',
          title: 'Certification and signature',
          CustomPage: ClaimantSignaturePage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    // Part 3: Medical Examination (Sections VI-VIII)
    examinerInformationChapter: {
      title: 'Section VI - Medical examiner information',
      pages: {
        examinerIdentification: {
          path: 'examiner-identification',
          title: 'Examiner identification',
          CustomPage: ExaminerIdentificationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        medicalDiagnosis: {
          path: 'medical-diagnosis',
          title: 'Medical diagnoses',
          CustomPage: MedicalDiagnosisPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    functionalAssessmentChapter: {
      title: 'Section VII - Functional assessment',
      pages: {
        adlAssessment: {
          path: 'adl-assessment',
          title: 'Activities of Daily Living',
          CustomPage: ADLAssessmentPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        functionalLimitations: {
          path: 'functional-limitations',
          title: 'Functional limitations',
          CustomPage: FunctionalLimitationsPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    narrativeAssessmentChapter: {
      title: 'Section VIII - Clinical narrative',
      pages: {
        narrativeAssessment: {
          path: 'narrative-assessment',
          title: 'Narrative and locomotion',
          CustomPage: NarrativeAssessmentPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        examinerSignature: {
          path: 'examiner-signature',
          title: 'Examiner certification',
          CustomPage: ExaminerSignaturePage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
  getHelp: GetHelp,
  footerContent,
};

export default formConfig;
