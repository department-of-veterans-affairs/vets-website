// @ts-check
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  diagnosisSchema,
  diagnosisUiSchema,
  disabilitiesSchema,
  disabilitiesUiSchema,
  examinationDateSchema,
  examinationDateUiSchema,
  physicalMeasurementsSchema,
  physicalMeasurementsUiSchema,
  nutritionSchema,
  nutritionUiSchema,
  gaitSchema,
  gaitUiSchema,
  vitalSignsSchema,
  vitalSignsUiSchema,
  bedConfinementSchema,
  bedConfinementUiSchema,
  assistanceWithActivitiesSchema,
  assistanceWithActivitiesUiSchema,
  blindnessSchema,
  blindnessUiSchema,
  nursingHomeCareSchema,
  nursingHomeCareUiSchema,
  benefitPaymentsManagementSchema,
  benefitPaymentsManagementUiSchema,
  postureSchema,
  postureUiSchema,
  upperExtremitiesSchema,
  upperExtremitiesUiSchema,
  lowerExtremitiesSchema,
  lowerExtremitiesUiSchema,
  spineTrunkAndNeckSchema,
  spineTrunkAndNeckUiSchema,
  otherPathologySchema,
  otherPathologyUiSchema,
  leaveHomeFrequencySchema,
  leaveHomeFrequencyUiSchema,
} from '@bio-aquia/21-2680-house-bound-status-secondary/pages';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status-secondary/constants';
import manifest from '@bio-aquia/21-2680-house-bound-status-secondary/manifest.json';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status-secondary/containers/introduction-page';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status-secondary/containers/confirmation-page';
import { GetHelp } from '@bio-aquia/21-2680-house-bound-status-secondary/components';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-2680-house-bound-status-secondary-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  getHelp: GetHelp,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  v3SegmentedProgressBar: { useDiv: true },
  formId: VA_FORM_IDS.FORM_21_2680_S,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your House Bound Status (Medical Professional) application (21-2680-S) is in progress.',
    //   expired: 'Your saved House Bound Status (Medical Professional) application (21-2680-S) has expired. If you want to apply for House Bound Status (Medical Professional), please start a new application.',
    //   saved: 'Your House Bound Status (Medical Professional) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for House Bound Status (Medical Professional).',
    noAuth:
      'Please sign in again to continue your application for House Bound Status (Medical Professional).',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    examinationOverviewChapter: {
      title: 'Examination Overview',
      pages: {
        examinationDate: {
          path: 'examination-date',
          title: 'Exam',
          uiSchema: examinationDateUiSchema,
          schema: examinationDateSchema,
        },
        diagnosis: {
          path: 'diagnosis',
          title: 'Diagnosis',
          uiSchema: diagnosisUiSchema,
          schema: diagnosisSchema,
        },
      },
    },
    patiendVitals: {
      title: 'Patient vitals',
      pages: {
        disabilities: {
          path: 'disabilities',
          title: 'Disabilities',
          uiSchema: disabilitiesUiSchema,
          schema: disabilitiesSchema,
        },
        physicalMeasurements: {
          path: 'physical-measurements',
          title: 'Physical measurements',
          uiSchema: physicalMeasurementsUiSchema,
          schema: physicalMeasurementsSchema,
        },
        nutrition: {
          path: 'nutrition',
          title: 'Nutrition',
          uiSchema: nutritionUiSchema,
          schema: nutritionSchema,
        },
        gait: {
          path: 'gait',
          title: 'Gait',
          uiSchema: gaitUiSchema,
          schema: gaitSchema,
        },
        vitalSigns: {
          path: 'vital-signs',
          title: 'Vital signs',
          uiSchema: vitalSignsUiSchema,
          schema: vitalSignsSchema,
        },
      },
    },
    disabilityDiagnosis: {
      title: 'Disability diagnosis',
      pages: {
        bedConfinement: {
          path: 'bed-confinement',
          title: 'Bed confinement',
          uiSchema: bedConfinementUiSchema,
          schema: bedConfinementSchema,
        },
        assistanceWithActivities: {
          path: 'assistance-with-activities',
          title: 'Assistance with activities',
          uiSchema: assistanceWithActivitiesUiSchema,
          schema: assistanceWithActivitiesSchema,
        },
        blindness: {
          path: 'blindness',
          title: 'Blindness',
          uiSchema: blindnessUiSchema,
          schema: blindnessSchema,
        },
        nursingHomeCare: {
          path: 'nursing-home-care',
          title: 'Nursing home care',
          uiSchema: nursingHomeCareUiSchema,
          schema: nursingHomeCareSchema,
        },
        benefitPaymentsManagement: {
          path: 'benefit-payments-management',
          title: 'Benefit payments management',
          uiSchema: benefitPaymentsManagementUiSchema,
          schema: benefitPaymentsManagementSchema,
        },
        posture: {
          path: 'posture',
          title: 'Posture',
          uiSchema: postureUiSchema,
          schema: postureSchema,
        },
        upperExtremities: {
          path: 'upper-extremities',
          title: 'Upper extremities',
          uiSchema: upperExtremitiesUiSchema,
          schema: upperExtremitiesSchema,
        },
        lowerExtremities: {
          path: 'lower-extremities',
          title: 'Lower extremities',
          uiSchema: lowerExtremitiesUiSchema,
          schema: lowerExtremitiesSchema,
        },
        spineTrunkAndNeck: {
          path: 'spine-trunk-and-neck',
          title: 'Spine, trunk and neck',
          uiSchema: spineTrunkAndNeckUiSchema,
          schema: spineTrunkAndNeckSchema,
        },
        otherPathology: {
          path: 'other-pathology',
          title: 'Other pathology',
          uiSchema: otherPathologyUiSchema,
          schema: otherPathologySchema,
        },
        leaveHomeFrequency: {
          path: 'leave-home-frequency',
          title: 'How often does the patient leave home?',
          uiSchema: leaveHomeFrequencyUiSchema,
          schema: leaveHomeFrequencySchema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
