import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import prefillTransformer from './prefill-transformer';

import applicantInfoConfirmInfo from '../pages/applicantInfoConfirmInfo';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import applicantRelationToVet from '../pages/applicantRelationToVet';
import applicantRelationToVetOrg from '../pages/applicantRelationToVetOrg';
import applicantRelationToVetOrg2 from '../pages/applicantRelationToVetOrg2';

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
  prefillTransformer,
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
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantConfirmPersonalInfo: {
          path: 'confirm-personal-information',
          title: 'Confirm the personal information we have on file for you',
          uiSchema: applicantInfoConfirmInfo.uiSchema,
          schema: applicantInfoConfirmInfo.schema,
          // depends: formData => formContext.isLoggedIn,
        },
        applicantRelationToVet: {
          path: 'applicant-relation-to-vet',
          title: 'Your relationship to the Veteran',
          uiSchema: applicantRelationToVet.uiSchema,
          schema: applicantRelationToVet.schema,
          // depends: formData => formContext.isLoggedIn,
        },
        applicantRelationToVetOrg: {
          path: 'applicant-relation-to-vet-org',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg.uiSchema,
          schema: applicantRelationToVetOrg.schema,
          depends: formData =>
            // formContext.isLoggedIn &&
            ['repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantRelationToVetOrg2: {
          path: 'applicant-relation-to-vet-org-2',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg2.uiSchema,
          schema: applicantRelationToVetOrg2.schema,
          depends: formData =>
            // formContext.isLoggedIn &&
            formData.relationToVetRadio === 'repOfVSO',
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
          path: 'phone-and-email-address-4',
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
