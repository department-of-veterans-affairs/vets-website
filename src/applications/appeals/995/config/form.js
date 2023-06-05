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
import ContactInfo, { customContactFocus } from '../components/ContactInfo';
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
import Notice5103 from '../components/Notice5103';
import submissionError from '../content/submissionError';
import reviewErrors from '../content/reviewErrors';

import veteranInfo from '../pages/veteranInfo';
import contactInfo from '../pages/contactInformation';
import primaryPhone from '../pages/primaryPhone';
import contestableIssues from '../pages/contestableIssues';
import issueSummary from '../pages/issueSummary';
import optIn from '../pages/optIn';
import notice5103 from '../pages/notice5103';
import evidencePrivateRecordsAuthorization from '../pages/evidencePrivateRecordsAuthorization';
import evidenceVaRecordsRequest from '../pages/evidenceVaRecordsRequest';
import evidencePrivateRequest from '../pages/evidencePrivateRequest';
import evidenceWillUpload from '../pages/evidenceWillUpload';
import evidenceUpload from '../pages/evidenceUpload';
import evidenceSummary from '../pages/evidenceSummary';

import { appStateSelector, mayHaveLegacyAppeals } from '../utils/helpers';
import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
} from '../utils/evidence';
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
  SUBMIT_URL,
} from '../constants';
import { saveInProgress, savedFormMessages } from '../content/formMessages';

import prefillTransformer from './prefill-transformer';
import submitForm from './submitForm';

// import fullSchema from 'vets-json-schema/dist/20-0995-schema.json';
import fullSchema from './form-0995-schema.json';

import {
  focusRadioH3,
  focusH3,
  focusIssue,
  focusEvidence,
  focusUploads,
} from '../utils/focus';

// const { } = fullSchema.properties;
const blankUiSchema = { 'ui:options': { hideOnReview: true } };
const blankSchema = { type: 'object', properties: {} };

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
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
  submissionError,
  // showReviewErrors: true,
  reviewErrors,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
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
          // needs useCustomScrollAndFocus: true to work
          scrollAndFocusTarget: customContactFocus,
        },
        editHomePhone: {
          title: 'Edit home phone number',
          path: 'edit-home-phone',
          CustomPage: EditHomePhone,
          CustomPageReview: EditHomePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
        },
        editMobilePhone: {
          title: 'Edit mobile phone number',
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
          scrollAndFocusTarget: focusRadioH3,
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
          scrollAndFocusTarget: focusIssue,
        },
        addIssue: {
          title: 'Add issues for review',
          path: ADD_ISSUE_PATH,
          depends: () => false, // accessed from contestable issues
          CustomPage: AddIssue,
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
          returnUrl: `/${CONTESTABLE_ISSUES_PATH}`,
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
          depends: mayHaveLegacyAppeals,
          uiSchema: optIn.uiSchema,
          schema: optIn.schema,
        },
      },
    },

    evidence: {
      title: 'New and relevant evidence',
      pages: {
        notice5103: {
          title: 'Notice of evidence needed',
          path: 'notice-of-evidence-needed',
          CustomPage: Notice5103,
          CustomPageReview: null, // reviewField renders this!
          uiSchema: notice5103.uiSchema,
          schema: notice5103.schema,
          scrollAndFocusTarget: focusH3,
          initialData: {
            form5103Acknowledged: false,
          },
        },
        evidenceVaRecordsRequest: {
          title: 'Request VA medical records',
          path: EVIDENCE_VA_REQUEST,
          uiSchema: evidenceVaRecordsRequest.uiSchema,
          schema: evidenceVaRecordsRequest.schema,
          scrollAndFocusTarget: focusH3,
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
          scrollAndFocusTarget: focusEvidence,
        },
        evidencePrivateRecordsRequest: {
          title: 'Request private medical records',
          path: EVIDENCE_PRIVATE_REQUEST,
          CustomPage: EvidencePrivateRequest,
          CustomPageReview: null,
          uiSchema: evidencePrivateRequest.uiSchema,
          schema: evidencePrivateRequest.schema,
          scrollAndFocusTarget: focusRadioH3,
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
          scrollAndFocusTarget: focusEvidence,
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
          scrollAndFocusTarget: focusH3,
        },
        evidenceUpload: {
          title: 'Uploaded evidence',
          path: EVIDENCE_UPLOAD_PATH,
          depends: hasOtherEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
          scrollAndFocusTarget: focusUploads,
        },
        evidenceSummary: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/summary',
          CustomPage: EvidenceSummary,
          CustomPageReview: EvidenceSummaryReview,
          uiSchema: evidenceSummary.uiSchema,
          schema: evidenceSummary.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
