// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from '../../shared/config/submit-transformer';
import getHelp from '../../shared/components/GetFormHelp';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import address from '../pages/address';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import { employersPages } from '../pages/employers';
import unemployed from '../pages/unemployed';
import evidence from '../pages/evidence';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  trackingPrefix: '21-4140-income-verification-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      fullNamePath: 'fullName',
    },
  },
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
        label: 'Disability benefits',
      },
      {
        href:
          '/disability/eligibility/special-claims/unemployability/employment-questionnaire-form-21-4140',
        label: 'Submit Employment Questionnaire',
      },
    ],
    wrapping: true,
  }),
  formId: VA_FORM_IDS.FORM_21_4140,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Employment Questionnaire (VA Form 21-4140) application (21-4140) is in progress.',
    //   expired: 'Your saved Employment Questionnaire (VA Form 21-4140) application (21-4140) has expired. If you want to apply for Employment Questionnaire (VA Form 21-4140), please start a new application.',
    //   saved: 'Your Employment Questionnaire (VA Form 21-4140) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Employment Questionnaire (VA Form 21-4140).',
    noAuth:
      'Please sign in again to continue your application for Employment Questionnaire (VA Form 21-4140).',
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
    mailingInformationChapter: {
      title: 'Your mailing information',
      pages: {
        address: {
          path: 'address',
          title: 'Your mailing address',
          uiSchema: address.uiSchema,
          schema: address.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Your phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    employmentHistoryChapter: {
      title: 'Your employment history',
      pages: employersPages,
    },
    unemployedChapter: {
      title: 'Unemployed',
      pages: {
        unemployed: {
          path: 'unemployed',
          title: 'Unemployed',
          uiSchema: unemployed.uiSchema,
          schema: unemployed.schema,
          depends: formData => !formData?.employers?.length,
        },
      },
    },
    evidenceChapter: {
      title: 'Evidence',
      pages: {
        evidence: {
          path: 'evidence',
          title: 'Upload your supporting evidence',
          uiSchema: evidence.uiSchema,
          schema: evidence.schema,
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
