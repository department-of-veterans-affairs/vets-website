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

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/burials-memorials',
        label: 'Burials memorials',
      },
      {
        href: '/burials-memorials/veterans-burial-allowance',
        label: 'Veterans burial allowance',
      },
      {
        href:
          '/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez',
        label: 'Apply for allowance form 21p 530ez',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21P_530,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21P-530) is in progress.',
    //   expired: 'Your saved benefits application (21P-530) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
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
    mailingAddressChapter: {
      title: 'Mailing address',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
