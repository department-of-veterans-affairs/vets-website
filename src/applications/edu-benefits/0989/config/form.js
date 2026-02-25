// @ts-check
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '~/platform/utilities/environment';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import schoolWasClosed from '../pages/schoolWasClosed';
import oldSchoolNameAndAddress from '../pages/oldSchoolNameAndAddress';
import eligibilityWarning from '../pages/eligibilityWarning';
import remarks from '../pages/remarks';

import prefillTransform from './prefillTransform';

export const SUBMIT_URL = `${
  environment.API_URL
}/v0/education_benefits_claims/0989`;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0989-edu-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0989,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your entitlement restoration application (22-0989) is in progress.',
    //   expired: 'Your saved entitlement restoration application (22-0989) has expired. If you want to apply for entitlement restoration, please start a new application.',
    //   saved: 'Your entitlement restoration application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over to apply for entitlement restoration.',
    noAuth:
      'Please sign in again to continue your application for entitlement restoration.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
        }),
      },
    },
    contactInfoChapter: {
      title: 'Your contact information',
      pages: {
        ...profileContactInfoPages({
          contactInfoRequiredKeys: ['mailingAddress', 'email'],
          // disableMockContactInfo: true,
          // prefillPatternEnabled: true,
        }),
      },
    },
    entitlementDetailsChapter: {
      title: 'Entitlement restoration details',
      pages: {
        schoolWasClosed: {
          path: 'school-closing',
          title: 'School closures and program suspension',
          uiSchema: schoolWasClosed.uiSchema,
          schema: schoolWasClosed.schema,
        },
        oldSchoolNameAndAddress: {
          path: 'school-name-and-address',
          title: 'School name and mailing address',
          uiSchema: oldSchoolNameAndAddress.uiSchema,
          schema: oldSchoolNameAndAddress.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        eligibilityWarning: {
          path: 'eligibility-warning',
          title: 'Eligibility warning',
          uiSchema: eligibilityWarning.uiSchema,
          schema: eligibilityWarning.schema,
          depends: formData => !formData.schoolWasClosed,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
