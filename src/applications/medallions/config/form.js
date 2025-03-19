import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../containers/GetFormHelp';

import personalInformation from '../pages/personalInformation';
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import supportingDocuments from '../pages/supportingDocuments';
import supportingDocumentsUpload from '../pages/supportingDocumentsUpload';
import viewPersonalInformation from '../pages/viewPersonalInformation';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'memorials-1330m',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_1330M,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Memorials benefits application (1330M) is in progress.',
    //   expired: 'Your saved Memorials benefits application (1330M) has expired. If you want to apply for Memorials benefits, please start a new application.',
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
  getHelp: GetFormHelp,
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        personalInformation: {
          path: 'personal-information',
          title: 'Your Name',
          uiSchema: viewPersonalInformation.uiSchema,
          schema: viewPersonalInformation.schema,
        },
        personalInformation2: {
          path: 'personal-information2',
          title: 'Your Name',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    veteranServicePeriods: {
      title: 'Veteran service periods',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    burialInformation: {
      title: 'Burial information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address-2',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    memorialItems: {
      title: 'Memorial items',
      pages: {
        memorialItems: {
          path: 'phone-and-email-address-3',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting documents',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Supporting documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        supportingDocumentsUpload: {
          path: 'supporting-documents-upload',
          title: 'Supporting Documents',
          uiSchema: supportingDocumentsUpload.uiSchema,
          schema: supportingDocumentsUpload.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
