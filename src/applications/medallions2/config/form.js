import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
// import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'memorials-1330m2',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_1330M2,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Memorials benefits application (1330M2) is in progress.',
    //   expired: 'Your saved Memorials benefits application (1330M2) has expired. If you want to apply for Memorials benefits, please start a new application.',
    //   saved: 'Your Memorials benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Memorials benefits.',
    noAuth:
      'Please sign in again to continue your application for Memorials benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        nameAndDateOfBirth: {
          path: 'applicant-information',
          title: 'Applicant information',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        // identificationInformation: {
        //   path: 'identification-information',
        //   title: 'Identification information',
        //   uiSchema: identificationInformation.uiSchema,
        //   schema: identificationInformation.schema,
        // },
      },
    },
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        mailingAddress: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    burialInformation: {
      title: 'Burial information',
      pages: {
        phoneAndEmailAddress: {
          path: 'burial-information',
          title: 'Burial information',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    memorialItems: {
      title: 'Memorial items',
      pages: {
        phoneAndEmailAddress: {
          path: 'memorial-items',
          title: 'Memorial items',
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
