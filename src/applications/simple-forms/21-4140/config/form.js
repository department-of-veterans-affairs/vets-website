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
import contactInformation from '../pages/contactInformation';
import employmentQuestion from '../pages/employmentQuestion';
import { employersPages } from '../pages/employmentHistory';
import unemployedCertification from '../pages/unemployedCertification';
import evidenceUpload from '../pages/evidenceUpload';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'disability-21-4140-',
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
          '/disability/eligibility/special-claims/unemployability/employment-questionnaire-form-21-4140',
        label: 'Employment questionnaire form 21 4140',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21_4140,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your disability benefits application (21-4140) is in progress.',
    //   expired: 'Your saved disability benefits application (21-4140) has expired. If you want to apply for disability benefits, please start a new application.',
    //   saved: 'Your disability benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disability benefits.',
    noAuth:
      'Please sign in again to continue your application for disability benefits.',
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
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    mailingInformationChapter: {
      title: "Veteran's mailing information",
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    contactInformationChapter: {
      title: "Veteran's contact information",
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Phone and email address',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    employmentHistoryChapter: {
      title: "Veteran's employment history",
      pages: {
        employmentQuestion: {
          path: 'employment-question',
          title: 'Have you had any employment in the past 12 months?',
          uiSchema: employmentQuestion.uiSchema,
          schema: employmentQuestion.schema,
        },
        ...employersPages,
      },
    },
    unemployedChapter: {
      title: "Veteran's employment history",
      pages: {
        unemployedCertification: {
          path: 'unemployed-certification',
          title: 'Unemployed',
          uiSchema: unemployedCertification.uiSchema,
          schema: unemployedCertification.schema,
        },
      },
    },
    evidenceChapter: {
      title: 'Evidence',
      pages: {
        evidenceUpload: {
          path: 'evidence-upload',
          title: 'Upload evidence in support of your unemployability.',
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
