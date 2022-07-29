import { VA_FORM_IDS } from 'platform/forms/constants';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import {
  EditPhone,
  EditEmail,
  EditAddress,
} from '../components/EditContactInfo';
import AddIssue from '../components/AddIssue';

import addIssue from '../pages/addIssue';
// import benefitType from '../pages/benefitType';
// import certifcationAndSignature from '../pages/certifcationAndSignature';
// import claimantName from '../pages/claimantName';
// import claimantType from '../pages/claimantType';
import contactInfo from '../pages/contactInformation';
import contestableIssues from '../pages/contestableIssues';
import evidencePrivateChoice from '../pages/evidencePrivateChoice';
import evidencePrivateRecords from '../pages/evidencePrivateRecords';
import evidencePrivateUpload from '../pages/evidencePrivateUpload';
import evidenceSummary from '../pages/evidenceSummary';
import evidenceTypes from '../pages/evidenceTypes';
import evidenceUpload from '../pages/evidenceUpload';
import evidenceVaRecords from '../pages/evidenceVaRecords';
import issueSummary from '../pages/issueSummary';
import noticeOfAcknowledgement from '../pages/noticeOfAcknowledgement';
import optIn from '../pages/optIn';
import veteranInfo from '../pages/veteranInfo';

import {
  appStateSelector,
  mayHaveLegacyAppeals,
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
  hasPrivateEvidenceToUpload,
} from '../utils/helpers';

import manifest from '../manifest.json';
import { CONTESTABLE_ISSUES_PATH } from '../constants';

// import fullSchema from 'vets-json-schema/dist/20-0995-schema.json';
import fullSchema from './form-0995-schema.json';
// const { } = fullSchema.properties;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '995-supplemental-claim-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_20_0995,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your VA Form 20-0995 (Supplemental Claim) application (20-0995) is in progress.',
    //   expired: 'Your saved VA Form 20-0995 (Supplemental Claim) application (20-0995) has expired. If you want to apply for VA Form 20-0995 (Supplemental Claim), please start a new application.',
    //   saved: 'Your VA Form 20-0995 (Supplemental Claim) application has been saved.',
    // },
  },
  version: migrations.length,
  migrations,
  // prefillTransformer,
  prefillEnabled: true,
  // verifyRequiredPrefill: true,

  savedFormMessages: {
    notFound:
      'Please start over to apply for VA Form 20-0995 (Supplemental Claim).',
    noAuth:
      'Please sign in again to continue your application for VA Form 20-0995 (Supplemental Claim).',
  },
  title: 'Request a Supplemental Claim',
  subTitle: 'VA Form 20-0995 (Supplemental Claim)',
  defaultDefinitions: fullSchema.definitions,
  preSubmitInfo,
  chapters: {
    infoPages: {
      title: 'Veteran Details',
      pages: {
        // benefitType: {
        //   title: 'Benefit Type',
        //   path: 'benefit-type',
        //   uiSchema: benefitType.uiSchema,
        //   schema: benefitType.schema,
        // },
        veteranInfo: {
          title: 'Veteran Information',
          path: 'veteran-information',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        // claimantType: {
        //   title: 'Claimant Type',
        //   path: 'claimant-type',
        //   uiSchema: claimantType.uiSchema,
        //   schema: claimantType.schema,
        // },
        // claimantName: {
        //   title: 'Claimant Name',
        //   path: 'claimant-name',
        //   uiSchema: claimantName.uiSchema,
        //   schema: claimantName.schema,
        //   depends: formData => formData.claimantType !== 'veteran',
        // },
        confirmContactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
        editMobilePhone: {
          title: 'Edit mobile phone',
          path: 'edit-mobile-phone',
          CustomPage: EditPhone,
          CustomPageReview: EditPhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editEmailAddress: {
          title: 'Edit email address',
          path: 'edit-email-address',
          CustomPage: EditEmail,
          CustomPageReview: EditEmail,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editMailingAddress: {
          title: 'Edit mailing address',
          path: 'edit-mailing-address',
          CustomPage: EditAddress,
          CustomPageReview: EditAddress,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },

    issues: {
      title: 'Issues',
      pages: {
        contestableIssues: {
          title: ' ',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
        },
        addIssue: {
          title: 'Add issues for review',
          path: 'add-issue',
          depends: () => false,
          CustomPage: AddIssue,
          CustomPageReview: null,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
        },
        optIn: {
          title: 'Opt in',
          path: 'opt-in',
          uiSchema: optIn.uiSchema,
          schema: optIn.schema,
          depends: formData => mayHaveLegacyAppeals(formData),
          initialData: {
            socOptIn: false,
          },
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
        },
      },
    },

    evidence: {
      title: 'Supporting Evidence',
      pages: {
        evidenceTypes: {
          title: 'Supporting evidence types',
          path: 'supporting-evidence/evidence-types',
          uiSchema: evidenceTypes.uiSchema,
          schema: evidenceTypes.schema,
        },
        evidenceVaRecords: {
          title: 'VA medical records',
          path: 'supporting-evidence/va-medical-records',
          depends: formData => hasVAEvidence(formData),
          uiSchema: evidenceVaRecords.uiSchema,
          schema: evidenceVaRecords.schema,
        },
        evidencePrivateChoice: {
          title: 'Private medical records',
          path: 'supporting-evidence/private-medical-records-choice',
          depends: hasPrivateEvidence,
          uiSchema: evidencePrivateChoice.uiSchema,
          schema: evidencePrivateChoice.schema,
        },
        evidencePrivateRecords: {
          title: 'Private medical records',
          path: 'supporting-evidence/get-private-medical-records',
          depends: formData =>
            hasPrivateEvidence(formData) &&
            !hasPrivateEvidenceToUpload(formData),
          uiSchema: evidencePrivateRecords.uiSchema,
          schema: evidencePrivateRecords.schema,
        },
        evidencePrivateUpload: {
          title: 'Private medical records',
          path: 'supporting-evidence/upload-private-medical-records',
          depends: formData =>
            hasPrivateEvidence(formData) &&
            hasPrivateEvidenceToUpload(formData),
          uiSchema: evidencePrivateUpload.uiSchema,
          schema: evidencePrivateUpload.schema,
        },
        evidenceUpload: {
          title: 'Lay statements and other evidence',
          path: 'supporting-evidence/additional-evidence',
          depends: hasOtherEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
        evidenceSummary: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/summary',
          uiSchema: evidenceSummary.uiSchema,
          schema: evidenceSummary.schema,
        },
      },
    },

    acknowledgement: {
      title: 'Notice of Acknowledgement',
      pages: {
        notice5103: {
          initialData: {
            form5103Acknowledged: false,
          },
          title: 'Notice of Acknowledgement',
          path: 'notice-of-acknowledgement',
          uiSchema: noticeOfAcknowledgement.uiSchema,
          schema: noticeOfAcknowledgement.schema,
        },
      },
    },

    // signature: {
    //   title: 'Certification & Signature',
    //   pages: {
    //     sign: {
    //       title: 'Certification & Signature',
    //       path: 'certification-and-signature',
    //       uiSchema: certifcationAndSignature.uiSchema,
    //       schema: certifcationAndSignature.schema,
    //     },
    //   },
    // },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
