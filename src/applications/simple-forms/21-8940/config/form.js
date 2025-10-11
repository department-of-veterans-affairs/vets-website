// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import serviceConnectedDisabilities from '../pages/serviceConnectedDisabilities';
import { medicalCareProvidersPages } from '../pages/medicalCareProviders';
import { hospitalizationsPages } from '../pages/hospitalizations';
import disabilityDates from '../pages/disabilityDates';
import incomeDetails from '../pages/incomeDetails';
import { employmentHistoryPages } from '../pages/employmentHistory';
import militaryService from '../pages/militaryService';
import currentIncome from '../pages/currentIncome';
import jobLeavingReason from '../pages/jobLeavingReason';
import reasonForLeavingJob from '../pages/reasonForLeavingJob';
import disabilityRetirement from '../pages/disabilityRetirement';
import workersCompensation from '../pages/workersCompensation';
import { jobSearchPages } from '../pages/jobSearch';
import educationLevel from '../pages/educationLevel';
import pastEducationTraining from '../pages/pastEducationTraining';
import pastTrainingDetails from '../pages/pastTrainingDetails';
import recentEducationTraining from '../pages/recentEducationTraining';
import recentTrainingDetails from '../pages/recentTrainingDetails';
import additionalInformation from '../pages/additionalInformation';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'disability-21-8940-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/disability',
        label: 'Disability',
      },
      {
        href: '/disability/eligibility',
        label: 'Eligibility',
      },
      {
        href: '/disability/eligibility/special-claims',
        label: 'Special claims',
      },
      {
        href: '/disability/eligibility/special-claims/unemployability',
        label: 'Unemployability',
      },
      {
        href:
          '/disability/eligibility/special-claims/unemployability/apply-form-21-8940',
        label: 'Apply form 21 8940',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21_8940,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your increased compensation based on unemployability application (21-8940) is in progress.',
    //   expired: 'Your saved increased compensation based on unemployability application (21-8940) has expired. If you want to apply for increased compensation based on unemployability, please start a new application.',
    //   saved: 'Your increased compensation based on unemployability application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for increased compensation based on unemployability.',
    noAuth:
      'Please sign in again to continue your application for increased compensation based on unemployability.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Your name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Your identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Your mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Your phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    disabilityAndMedicalTreatmentChapter: {
      title: 'Disability and medical treatment',
      pages: {
        serviceConnectedDisabilities: {
          path: 'service-connected-disabilities',
          title: 'Service-connected disabilities that affect your work',
          uiSchema: serviceConnectedDisabilities.uiSchema,
          schema: serviceConnectedDisabilities.schema,
        },
        ...medicalCareProvidersPages,
        ...hospitalizationsPages,
      },
    },
    disabilityImpactOnEmploymentChapter: {
      title: 'Disability impact on employment',
      pages: {
        disabilityDates: {
          path: 'disability-dates',
          title: 'Disability dates',
          uiSchema: disabilityDates.uiSchema,
          schema: disabilityDates.schema,
        },
        incomeDetails: {
          path: 'income-details',
          title: 'Income details',
          uiSchema: incomeDetails.uiSchema,
          schema: incomeDetails.schema,
        },
      },
    },
    employmentHistoryChapter: {
      title: 'Employment history',
      pages: {
        ...employmentHistoryPages,
      },
    },
    currentEmploymentChapter: {
      title: 'Current employment',
      pages: {
        militaryService: {
          path: 'military-service',
          title: 'Military service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
        currentIncome: {
          path: 'current-income',
          title: 'Current income',
          uiSchema: currentIncome.uiSchema,
          schema: currentIncome.schema,
        },
        jobLeavingReason: {
          path: 'leaving-work-due-to-disability',
          title: 'Job leaving reason',
          uiSchema: jobLeavingReason.uiSchema,
          schema: jobLeavingReason.schema,
        },
        reasonForLeavingJob: {
          path: 'reason-for-leaving-job',
          title: 'Reason for leaving your last job',
          depends: formData => formData.leftJobDueToDisability === true,
          uiSchema: reasonForLeavingJob.uiSchema,
          schema: reasonForLeavingJob.schema,
        },
        disabilityRetirement: {
          path: 'disability-retirement',
          title: 'Disability retirement benefits',
          uiSchema: disabilityRetirement.uiSchema,
          schema: disabilityRetirement.schema,
        },
        workersCompensation: {
          path: 'workers-compensation',
          title: 'Workers’ compensation benefits',
          uiSchema: workersCompensation.uiSchema,
          schema: workersCompensation.schema,
        },
        ...jobSearchPages,
      },
    },
    educationAndTrainingChapter: {
      title: 'Education and training',
      pages: {
        educationLevel: {
          path: 'education-level',
          title: 'Education level',
          uiSchema: educationLevel.uiSchema,
          schema: educationLevel.schema,
        },
        pastEducationTraining: {
          path: 'past-education-training',
          title: 'Past education and training',
          uiSchema: pastEducationTraining.uiSchema,
          schema: pastEducationTraining.schema,
        },
        pastTrainingDetails: {
          path: 'past-training-details',
          title: 'Details of your past training',
          depends: formData => formData.pastEducationTraining === true,
          uiSchema: pastTrainingDetails.uiSchema,
          schema: pastTrainingDetails.schema,
        },
        recentEducationTraining: {
          path: 'recent-education-training',
          title: 'Recent education and training',
          uiSchema: recentEducationTraining.uiSchema,
          schema: recentEducationTraining.schema,
        },
        recentTrainingDetails: {
          path: 'recent-training-details',
          title: 'Details of your recent training',
          depends: formData => formData.recentEducationTraining === true,
          uiSchema: recentTrainingDetails.uiSchema,
          schema: recentTrainingDetails.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional information',
      pages: {
        additionalInformation: {
          path: 'additional-information',
          title: 'Additional information',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
