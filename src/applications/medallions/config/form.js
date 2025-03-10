import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../containers/GetFormHelp';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import veteranName from '../pages/veteranName';
import veteranInfo1 from '../pages/veteranInfo1';
import veteranInfo2 from '../pages/veteranInfo2';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import supportingDocuments from '../pages/supportingDocuments';
import supportingDocumentsUpload from '../pages/supportingDocumentsUpload';

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
        veteranName: {
          path: 'veteran-name',
          title: 'Veteran name',
          uiSchema: veteranName.uiSchema,
          schema: veteranName.schema,
        },
        veteranInfo1: {
          path: 'veteran-info-1',
          title: 'Veteran personal information',
          uiSchema: veteranInfo1.uiSchema,
          schema: veteranInfo1.schema,
        },
        veteranInfo2: {
          path: 'veteran-info-2',
          title: 'Veteran personal information',
          uiSchema: veteranInfo2.uiSchema,
          schema: veteranInfo2.schema,
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
