import { VA_FORM_IDS } from 'platform/forms/constants';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import migrations from '../migrations';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import {
  EditHomePhone,
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../components/EditContactInfo';
import ContactInfo from '../components/ContactInfo';
import ContactInfoReview from '../components/ContactInfoReview';
import AddIssue from '../components/AddIssue';
import PrimaryPhone from '../components/PrimaryPhone';
import PrimaryPhoneReview from '../components/PrimaryPhoneReview';
import EvidenceVaRecords from '../components/EvidenceVaRecords';
import EvidencePrivateRequest from '../components/EvidencePrivateRecordsRequest';
import EvidencePrivateRecordsAuthorization from '../components/EvidencePrivateRecordsAuthorization';
import EvidencePrivateRecords from '../components/EvidencePrivateRecords';
import EvidencePrivateLimitation from '../components/EvidencePrivateLimitation';
import EvidenceSummary from '../components/EvidenceSummary';
import EvidenceSummaryReview from '../components/EvidenceSummaryReview';

import contactInfo from '../pages/contactInformation';
import primaryPhone from '../pages/primaryPhone';
import contestableIssues from '../pages/contestableIssues';
import evidencePrivateRecordsAuthorization from '../pages/evidencePrivateRecordsAuthorization';
import evidenceVaRecordsRequest from '../pages/evidenceVaRecordsRequest';
import evidencePrivateRequest from '../pages/evidencePrivateRequest';
import evidenceWillUpload from '../pages/evidenceWillUpload';
import evidenceUpload from '../pages/evidenceUpload';
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
} from '../utils/helpers';
import { hasHomeAndMobilePhone } from '../utils/contactInfo';

import manifest from '../manifest.json';
import {
  CONTACT_INFO_PATH,
  CONTESTABLE_ISSUES_PATH,
  ADD_ISSUE_PATH,
  EVIDENCE_VA_REQUEST,
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_REQUEST,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_ADDITIONAL_PATH,
  EVIDENCE_UPLOAD_PATH,
} from '../constants';
import { saveInProgress, savedFormMessages } from '../content/formMessages';

import prefillTransformer from './prefill-transformer';

// import fullSchema from 'vets-json-schema/dist/20-0995-schema.json';
import fullSchema from './form-0995-schema.json';

// const { } = fullSchema.properties;
const blankUiSchema = { 'ui:options': { hideOnReview: true } };
const blankSchema = { type: 'object', properties: {} };

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
  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  // verifyRequiredPrefill: true,
  downtime: {
    requiredForPrefill: true,
    dependencies: [services.vaProfile],
  },
  saveInProgress,
  savedFormMessages,
  title: 'File a Supplemental Claim',
  subTitle: 'VA Form 20-0995',
  defaultDefinitions: fullSchema.definitions,
  preSubmitInfo,
  chapters: {
    infoPages: {
      title: 'Veteran information',
      pages: {
        veteranInfo: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        confirmContactInformation: {
          title: 'Contact information',
          path: CONTACT_INFO_PATH,
          CustomPage: ContactInfo,
          CustomPageReview: ContactInfoReview,
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
        editHomePhone: {
          title: 'Edit phone number',
          path: 'edit-home-phone',
          CustomPage: EditHomePhone,
          CustomPageReview: EditHomePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
        },
        editMobilePhone: {
          title: 'Edit phone number',
          path: 'edit-mobile-phone',
          CustomPage: EditMobilePhone,
          CustomPageReview: EditMobilePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
        },
        editEmailAddress: {
          title: 'Edit email address',
          path: 'edit-email-address',
          CustomPage: EditEmail,
          CustomPageReview: EditEmail,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
        },
        editMailingAddress: {
          title: 'Edit mailing address',
          path: 'edit-mailing-address',
          CustomPage: EditAddress,
          CustomPageReview: EditAddress,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
        },
        choosePrimaryPhone: {
          title: 'Primary phone number',
          path: 'primary-phone-number',
          // only visible if both the home & mobile phone are populated
          depends: hasHomeAndMobilePhone,
          CustomPage: PrimaryPhone,
          CustomPageReview: PrimaryPhoneReview,
          uiSchema: primaryPhone.uiSchema,
          schema: primaryPhone.schema,
        },
      },
    },

    issues: {
      title: 'Issues for review',
      pages: {
        contestableIssues: {
          title: 'Issues',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
        },
        addIssue: {
          title: 'Add issues for review',
          path: ADD_ISSUE_PATH,
          depends: () => false, // accessed from contestable issues
          CustomPage: AddIssue,
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
        },
        optIn: {
          title: 'Opt in',
          path: 'opt-in',
          uiSchema: optIn.uiSchema,
          schema: optIn.schema,
          depends: mayHaveLegacyAppeals,
          initialData: {
            socOptIn: false,
          },
        },
      },
    },

    evidence: {
      title: 'New and relevant evidence',
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
        evidenceVaRecordsRequest: {
          title: 'Request VA medical records',
          path: EVIDENCE_VA_REQUEST,
          uiSchema: evidenceVaRecordsRequest.uiSchema,
          schema: evidenceVaRecordsRequest.schema,
        },
        evidenceVaRecords: {
          title: 'VA medical records',
          path: EVIDENCE_VA_PATH,
          depends: hasVAEvidence,
          CustomPage: EvidenceVaRecords,
          CustomPageReview: null,
          uiSchema: blankUiSchema,
          schema: blankSchema,
          hideHeaderRow: true,
        },
        evidencePrivateRecordsRequest: {
          title: 'Request private medical records',
          path: EVIDENCE_PRIVATE_REQUEST,
          CustomPage: EvidencePrivateRequest,
          CustomPageReview: null,
          uiSchema: evidencePrivateRequest.uiSchema,
          schema: evidencePrivateRequest.schema,
        },
        evidencePrivateRecordsAuthorization: {
          title: 'Private medical record authorization',
          path: 'supporting-evidence/private-medical-records-authorization',
          depends: hasPrivateEvidence,
          CustomPage: EvidencePrivateRecordsAuthorization,
          CustomPageReview: null,
          uiSchema: evidencePrivateRecordsAuthorization.uiSchema,
          schema: evidencePrivateRecordsAuthorization.schema,
        },
        evidencePrivateRecords: {
          title: 'Private medical records',
          path: EVIDENCE_PRIVATE_PATH,
          depends: hasPrivateEvidence,
          CustomPage: EvidencePrivateRecords,
          CustomPageReview: null,
          uiSchema: blankUiSchema,
          schema: blankSchema,
        },
        evidencePrivateLimitation: {
          title: 'Private medical record limitations',
          path: EVIDENCE_LIMITATION_PATH,
          depends: hasPrivateEvidence,
          CustomPage: EvidencePrivateLimitation,
          CustomPageReview: null,
          uiSchema: blankUiSchema,
          schema: blankSchema,
        },
        evidenceWillUpload: {
          title: 'Upload new and relevant evidence',
          path: EVIDENCE_ADDITIONAL_PATH,
          uiSchema: evidenceWillUpload.uiSchema,
          schema: evidenceWillUpload.schema,
        },
        evidenceUpload: {
          title: 'Uploaded evidence',
          path: EVIDENCE_UPLOAD_PATH,
          depends: hasOtherEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
        evidenceSummary: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/summary',
          CustomPage: EvidenceSummary,
          CustomPageReview: EvidenceSummaryReview,
          uiSchema: {},
          schema: blankSchema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
