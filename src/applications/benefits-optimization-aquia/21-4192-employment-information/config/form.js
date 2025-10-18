/**
 * @module config/form
 * @description Main form configuration for VA Form 21-4192 - Request for Employment Information
 * in Connection with Claim for Disability Benefits
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
// Commented out until schemas are implemented
// import {
//   createPageValidator,
//   createValidationErrorHandler,
// } from '@bio-aquia/shared/utils';
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
  EmployerInformationPage,
  VeteranInformationPage,
  EmploymentDetailsPage,
  TerminationInformationPage,
  BenefitsInformationPage,
  ReserveGuardQuestionPage,
  ReserveGuardStatusPage,
  CertificationPage,
} from '@bio-aquia/21-4192-employment-information/pages';

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
    identificationChapter: {
      title: 'Section I - Identification Information',
      pages: {
        employerInformation: {
          path: 'employer-information',
          title: 'Employer information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmployerInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran identification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    employmentInformationChapter: {
      title: 'Section II - Employment Information',
      pages: {
        employmentDetails: {
          path: 'employment-details',
          title: 'Employment details',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: EmploymentDetailsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
        terminationInformation: {
          path: 'termination-information',
          title: 'Termination information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: TerminationInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          depends: formData =>
            formData?.employmentEndDate !== undefined &&
            formData?.employmentEndDate !== '',
        },
      },
    },
    reserveGuardChapter: {
      title: 'Section III - Reserve or National Guard',
      pages: {
        reserveGuardQuestion: {
          path: 'reserve-guard-question',
          title: 'Military service status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ReserveGuardQuestionPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
        reserveGuardStatus: {
          path: 'reserve-guard-status',
          title: 'Reserve or National Guard status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ReserveGuardStatusPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          depends: formData => formData?.isReserveOrGuard === 'yes',
        },
      },
    },
    benefitsChapter: {
      title: 'Section IV - Benefit Information',
      pages: {
        benefitsInformation: {
          path: 'benefits-information',
          title: 'Benefits and payments',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: BenefitsInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    certificationChapter: {
      title: 'Certification',
      pages: {
        certification: {
          path: 'certification',
          title: 'Employer certification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CertificationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
  },
};

export default formConfig;
