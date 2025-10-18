/**
 * @module config/form
 * @description Main form configuration for VA Form 21-4192 - Request for Employment Information
 * in Connection with Claim for Disability Benefits
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  createPageValidator,
  createValidationErrorHandler,
} from '@bio-aquia/shared/utils';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-4192-employment-information/constants';
import ConfirmationPage from '@bio-aquia/21-4192-employment-information/containers/confirmation-page';
import IntroductionPage from '@bio-aquia/21-4192-employment-information/containers/introduction-page';
import manifest from '@bio-aquia/21-4192-employment-information/manifest.json';
import GetHelpFooter from '@bio-aquia/21-4192-employment-information/components/get-help';

// Import page components
import {
  VeteranInformationPage,
  EmployerInformationPage,
  EmploymentDatesDetailsPage,
  EmploymentConcessionsPage,
  EmploymentTerminationPage,
  EmploymentLastPaymentPage,
  DutyStatusPage,
  BenefitsInformationPage,
  RemarksPage,
} from '@bio-aquia/21-4192-employment-information/pages';

// Import schemas
import {
  employerInformationSchema,
  employmentConcessionsSchema,
  employmentDatesDetailsSchema,
  employmentLastPaymentSchema,
  employmentTerminationSchema,
  veteranInformationSchema,
} from '@bio-aquia/21-4192-employment-information/schemas';

const defaultSchema = {
  type: 'object',
  properties: {},
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/form21_4192',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-4192-employment-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelpFooter,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_4192,
  saveInProgress: {
    messages: {
      inProgress: 'Your employment information form (21-4192) is in progress.',
      expired:
        'Your saved employment information form (21-4192) has expired. If you want to submit your information, please start a new form.',
      saved: 'Your employment information form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to submit your employment information.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(veteranInformationSchema)(values),
          onErrorChange: createValidationErrorHandler('veteranInformation'),
        },
      },
    },
    employerInformationChapter: {
      title: 'Employers Information',
      pages: {
        employerInformation: {
          path: 'employer-information',
          title: 'Employers Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmployerInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(employerInformationSchema)(values),
          onErrorChange: createValidationErrorHandler('employerInformation'),
        },
      },
    },
    employmentInformationChapter: {
      title: 'Employment Information',
      pages: {
        employmentDatesDetails: {
          path: 'employment-dates-details',
          title: 'Employment Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmploymentDatesDetailsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(employmentDatesDetailsSchema)(values),
          onErrorChange: createValidationErrorHandler('employmentDatesDetails'),
        },
        employmentConcessions: {
          path: 'employment-concessions',
          title: 'Employment Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmploymentConcessionsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(employmentConcessionsSchema)(values),
          onErrorChange: createValidationErrorHandler('employmentConcessions'),
        },
        employmentTermination: {
          path: 'employment-termination',
          title: 'Employment Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmploymentTerminationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(employmentTerminationSchema)(values),
          onErrorChange: createValidationErrorHandler('employmentTermination'),
        },
        employmentLastPayment: {
          path: 'employment-last-payment',
          title: 'Employment Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmploymentLastPaymentPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(employmentLastPaymentSchema)(values),
          onErrorChange: createValidationErrorHandler('employmentLastPayment'),
        },
      },
    },
    dutyStatusChapter: {
      title: 'Duty Status',
      pages: {
        dutyStatus: {
          path: 'duty-status',
          title: 'Duty Status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: DutyStatusPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    benefitsInformationChapter: {
      title: 'Benefits Information',
      pages: {
        benefitsInformation: {
          path: 'benefits-information',
          title: 'Benefits Information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: BenefitsInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: RemarksPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
  },
};

export default formConfig;
