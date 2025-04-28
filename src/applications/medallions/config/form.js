import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../containers/GetFormHelp';

import applicantName from '../pages/applicantName';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import applicantRelationToVet from '../pages/applicantRelationToVet';
import applicantRelationToVetOrg from '../pages/applicantRelationToVetOrg';
import applicantRelationToVetOrg2 from '../pages/applicantRelationToVetOrg2';
import applicantContactInfo from '../pages/applicantContactInfo';
import applicantContactInfo2 from '../pages/applicantContactInfo2';
import applicantMailingAddress from '../pages/applicantMailingAddress';
import applicantMailingAddress2 from '../pages/applicantMailingAddress2';
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
        applicantName: {
          path: 'applicant-name',
          title: 'Your name',
          uiSchema: applicantName.uiSchema,
          schema: applicantName.schema,
        },
        applicantRelationToVet: {
          path: 'applicant-relation-to-vet',
          title: 'Your relationship to the Veteran',
          uiSchema: applicantRelationToVet.uiSchema,
          schema: applicantRelationToVet.schema,
        },
        applicantRelationToVetOrg: {
          path: 'applicant-relation-to-vet-org',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg.uiSchema,
          schema: applicantRelationToVetOrg.schema,
          depends: formData =>
            ['repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantRelationToVetOrg2: {
          path: 'applicant-relation-to-vet-org-2',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg2.uiSchema,
          schema: applicantRelationToVetOrg2.schema,
          depends: formData => formData.relationToVetRadio === 'repOfVSO',
        },
        applicantContactInfo: {
          path: 'applicant-contact-info',
          title: 'Your contact information',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
          depends: formData =>
            ['familyMember', 'personalRep', 'other'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantContactInfo2: {
          path: 'applicant-contact-info-2',
          title: 'Your organization’s contact information',
          uiSchema: applicantContactInfo2.uiSchema,
          schema: applicantContactInfo2.schema,
          depends: formData =>
            ['repOfVSO', 'repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantMailingAddress: {
          path: 'applicant-mailing-address',
          title: 'Your mailing address',
          uiSchema: applicantMailingAddress.uiSchema,
          schema: applicantMailingAddress.schema,
          depends: formData =>
            ['familyMember', 'personalRep', 'other'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantMailingAddress2: {
          path: 'applicant-mailing-address-2',
          title: 'Your organization’s mailing address ',
          uiSchema: applicantMailingAddress2.uiSchema,
          schema: applicantMailingAddress2.schema,
          depends: formData =>
            ['repOfVSO', 'repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
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
