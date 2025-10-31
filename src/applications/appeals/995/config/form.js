import { VA_FORM_IDS } from 'platform/forms/constants';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import migrations from '../migrations';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../components/ConfirmationPage';
import SubTaskContainer from '../subtask/SubTaskContainer';

import AddContestableIssue from '../components/AddContestableIssue';
import PrimaryPhone from '../components/PrimaryPhone';
import PrimaryPhoneReview from '../components/PrimaryPhoneReview';
import EvidenceVaRecords from '../components/EvidenceVaRecords';
import EvidencePrivateRequest from '../components/EvidencePrivateRecordsRequest';
import PrivateRecordsAuthorization from '../components/4142/Authorization';
import EvidencePrivateRecords from '../components/EvidencePrivateRecords';
import EvidenceSummary from '../components/EvidenceSummary';
import EvidenceSummaryReview from '../components/EvidenceSummaryReview';
import Notice5103 from '../components/Notice5103';
import reviewErrors from '../content/reviewErrors';

import veteranInfo from '../pages/veteranInfo';
import contactInfo from '../pages/contactInformation';
import addIssue from '../pages/addIssue';
import primaryPhone from '../pages/primaryPhone';

import housingRisk from '../pages/housingRisk';
import livingSituation from '../pages/livingSituation';
import otherHousingRisk from '../pages/otherHousingRisk';
import pointOfContact from '../pages/pointOfContact';

import contestableIssues from '../pages/contestableIssues';
import issueSummary from '../pages/issueSummary';
import optIn from '../pages/optIn';
import optionForMst from '../pages/optionForMst';
import optionIndicator from '../pages/optionIndicator';

import notice5103 from '../pages/notice5103';
import facilityTypes from '../pages/facilityTypes';
import evidencePrivateRecordsAuthorization from '../pages/evidencePrivateRecordsAuthorization';
import evidenceVaPrompt from '../pages/evidenceVaPrompt';
import evidenceVaDetails from '../pages/evidenceVaDetails';
import evidencePrivateRequest from '../pages/evidencePrivateRequest';
import limitedConsentPromptPage from '../pages/limitedConsentPrompt';
import limitedConsentDetailsPage from '../pages/limitedConsentDetails';
import evidencePrivateRecords from '../pages/evidencePrivateRecords';
import evidenceWillUpload from '../pages/evidenceWillUpload';
import evidenceUpload from '../pages/evidenceUpload';
import evidenceSummary from '../pages/evidenceSummary';

import {
  hasOtherEvidence,
  hasVAEvidence,
  hasPrivateEvidence,
  hasPrivateLimitation,
  hasMstOption,
  hasHousingRisk,
  hasOtherHousingRisk,
} from '../utils/form-data-retrieval';
import { onFormLoaded } from '../utils/evidence';
import { hasHomeAndMobilePhone } from '../../shared/utils/contactInfo';

import manifest from '../manifest.json';
import {
  ADD_ISSUE_URL,
  EVIDENCE_VA_PROMPT_URL,
  EVIDENCE_VA_DETAILS_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  LIMITED_CONSENT_DETAILS_URL,
  LIMITED_CONSENT_PROMPT_URL,
  EVIDENCE_ADDITIONAL_URL,
  EVIDENCE_UPLOAD_URL,
} from '../constants';
import { SUBMIT_URL } from '../constants/apis';
import { saveInProgress, savedFormMessages } from '../content/formMessages';
import { title995, getSubTitle } from '../content/title';

import prefillTransformer from './prefill-transformer';
import submitForm from './submitForm';

// import fullSchema from 'vets-json-schema/dist/20-0995-schema.json';
import fullSchema from './form-0995-schema.json';

import { focusEvidence } from '../utils/focus';

import submissionError from '../../shared/content/submissionError';
import GetFormHelp from '../../shared/content/GetFormHelp';
import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import {
  focusAlertH3,
  focusRadioH3,
  focusAlertOrRadio,
  focusH3,
  focusOnAlert,
  focusIssue,
} from '../../shared/utils/focus';

import {
  mayHaveLegacyAppeals,
  appStateSelector,
} from '../../shared/utils/issues';

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
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile, // for contact info
      services.mvi, // contestable issues
      services.appeals, // LOA3 & SSN
    ],
  },
  saveInProgress,
  savedFormMessages,
  title: title995,
  subTitle: getSubTitle,
  defaultDefinitions: fullSchema.definitions,
  preSubmitInfo,
  submissionError,
  reviewErrors,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  scrollAndFocusTarget: focusH3, // scroll and focus fallback
  reviewEditFocusOnHeaders: true,
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,
  onFormLoaded,
  formOptions: {
    focusOnAlertRole: true,
    useWebComponentForNavigation: true,
  },
  additionalRoutes: [
    {
      path: 'start',
      component: SubTaskContainer,
      pageKey: 'start',
      depends: () => false,
    },
  ],
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
        housingRisk: {
          title: 'Housing risks',
          path: 'housing-risk',
          uiSchema: housingRisk.uiSchema,
          schema: housingRisk.schema,
          scrollAndFocusTarget: focusAlertOrRadio,
        },
        livingSituation: {
          title: 'Living situation',
          path: 'living-situation',
          uiSchema: livingSituation.uiSchema,
          schema: livingSituation.schema,
          depends: hasHousingRisk,
          scrollAndFocusTarget: focusRadioH3,
        },
        otherHousingRisk: {
          title: 'Other housing risks',
          path: 'other-housing-risks',
          uiSchema: otherHousingRisk.uiSchema,
          schema: otherHousingRisk.schema,
          depends: hasOtherHousingRisk,
          initialData: {
            'view:otherHousingRisk': {},
          },
        },
        contact: {
          title: 'Your point of contact',
          path: 'point-of-contact',
          uiSchema: pointOfContact.uiSchema,
          schema: pointOfContact.schema,
          depends: hasHousingRisk,
        },
        ...contactInfo,
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
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
          scrollAndFocusTarget: focusIssue,
          onContinue: focusOnAlert,
        },
        addIssue: {
          title: 'Add issues for review',
          path: ADD_ISSUE_URL,
          depends: () => false, // accessed from contestable issues
          CustomPage: AddContestableIssue,
          CustomPageReview: null,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
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
          scrollAndFocusTarget: focusAlertH3,
          initialData: {
            form5103Acknowledged: false,
          },
        },
        facilityTypes: {
          title: 'Facility types',
          path: 'facility-types',
          uiSchema: facilityTypes.uiSchema,
          schema: facilityTypes.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidenceVaPrompt: {
          title: 'VA medical records prompt',
          path: EVIDENCE_VA_PROMPT_URL,
          uiSchema: evidenceVaPrompt.uiSchema,
          schema: evidenceVaPrompt.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidenceVaDetails: {
          title: 'VA medical records details',
          path: EVIDENCE_VA_DETAILS_URL,
          depends: hasVAEvidence,
          CustomPage: EvidenceVaRecords,
          CustomPageReview: null,
          uiSchema: evidenceVaDetails.uiSchema,
          schema: evidenceVaDetails.schema,
          hideHeaderRow: true,
          scrollAndFocusTarget: focusEvidence,
        },
        evidencePrivateRecordsRequest: {
          title: 'Request non-VA medical records',
          path: EVIDENCE_PRIVATE_PROMPT_URL,
          CustomPage: EvidencePrivateRequest,
          CustomPageReview: null,
          uiSchema: evidencePrivateRequest.uiSchema,
          schema: evidencePrivateRequest.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidencePrivateRecordsAuthorization: {
          title: 'Non-VA medical record authorization',
          path: 'supporting-evidence/private-medical-records-authorization',
          depends: hasPrivateEvidence,
          CustomPage: PrivateRecordsAuthorization,
          CustomPageReview: null,
          uiSchema: evidencePrivateRecordsAuthorization.uiSchema,
          schema: evidencePrivateRecordsAuthorization.schema,
        },
        limitedConsentPrompt: {
          title: 'Non-VA medical record: limited consent prompt',
          path: LIMITED_CONSENT_PROMPT_URL,
          depends: hasPrivateEvidence,
          uiSchema: limitedConsentPromptPage.uiSchema,
          schema: limitedConsentPromptPage.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        limitedConsentDetails: {
          title: 'Non-VA medical record: limited consent details',
          path: LIMITED_CONSENT_DETAILS_URL,
          depends: hasPrivateLimitation,
          uiSchema: limitedConsentDetailsPage.uiSchema,
          schema: limitedConsentDetailsPage.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidencePrivateRecords: {
          title: 'Non-VA medical records',
          path: EVIDENCE_PRIVATE_DETAILS_URL,
          depends: hasPrivateEvidence,
          CustomPage: EvidencePrivateRecords,
          CustomPageReview: null,
          uiSchema: evidencePrivateRecords.uiSchema,
          schema: evidencePrivateRecords.schema,
          scrollAndFocusTarget: focusEvidence,
        },
        evidenceWillUpload: {
          title: 'Upload new and relevant evidence',
          path: EVIDENCE_ADDITIONAL_URL,
          uiSchema: evidenceWillUpload.uiSchema,
          schema: evidenceWillUpload.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidenceUpload: {
          title: 'Uploaded evidence',
          path: EVIDENCE_UPLOAD_URL,
          depends: hasOtherEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
        evidenceSummary: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/summary',
          CustomPage: EvidenceSummary,
          CustomPageReview: EvidenceSummaryReview,
          uiSchema: evidenceSummary.uiSchema,
          schema: evidenceSummary.schema,
          scrollAndFocusTarget: focusAlertH3,
        },
      },
    },
    vhaIndicator: {
      title: 'VHA Indicator',
      pages: {
        optionForMst: {
          title: 'Option for claims related to MST',
          path: 'option-claims',
          uiSchema: optionForMst.uiSchema,
          schema: optionForMst.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        optionIndicator: {
          title: 'Option to add an indicator',
          path: 'option-indicator',
          uiSchema: optionIndicator.uiSchema,
          schema: optionIndicator.schema,
          depends: hasMstOption,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
