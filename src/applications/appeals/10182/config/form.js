import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
import submitForm from './submitForm';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AddContestableIssue from '../components/AddContestableIssue';

import {
  canUploadEvidence,
  wantsToUploadEvidence,
  needsHearingType,
  showExtensionReason,
} from '../utils/helpers';

// Pages
import veteranInfo from '../pages/veteranInfo';
import homeless from '../pages/homeless';
import contactInfo from '../pages/contactInfo';
import contestableIssues from '../pages/contestableIssues';
import addIssue from '../pages/addIssue';
import areaOfDisagreementFollowUp from '../../shared/pages/areaOfDisagreement';
import AreaOfDisagreement from '../../shared/components/AreaOfDisagreement';
import extensionRequest from '../pages/extensionRequest';
import extensionReason from '../pages/extensionReason';
import appealingVhaDenial from '../pages/appealingVhaDenial';
import filingDeadlines from '../pages/filingDeadlines';
import issueSummary from '../pages/issueSummary';
import boardReview from '../pages/boardReview';
import hearingType from '../pages/hearingType';
import evidenceIntro from '../pages/evidenceIntro';
import evidenceUpload from '../pages/evidenceUpload';

import {
  customText,
  saveInProgress,
  savedFormMessages,
} from '../content/saveInProgress';

import submissionError from '../../shared/content/submissionError';
import { getIssueTitle } from '../../shared/content/areaOfDisagreement';
import { appStateSelector } from '../../shared/utils/issues';
import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import GetFormHelp from '../../shared/content/GetFormHelp';
import reviewErrors from '../../shared/content/reviewErrors';
import { focusRadioH3, focusH3 } from '../../shared/utils/focus';

// import initialData from '../tests/initialData';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: 'notice_of_disagreements',
  trackingPrefix: '10182-board-appeal-',

  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile, // for contact info
      services.bgs, // submission
      services.mvi, // contestable issues
      services.appeals, // LOA3 & SSN
    ],
  },

  formId: VA_FORM_IDS.FORM_10182,
  version: migrations.length,
  migrations,
  title: 'Request a Board Appeal',
  subTitle: 'VA Form 10182 (Notice of Disagreement)',

  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,
  preSubmitInfo,
  submit: submitForm,
  // showReviewErrors: true,
  reviewErrors,
  // SaveInProgress messages
  customText,
  savedFormMessages,
  saveInProgress,
  // errorText: '',
  submissionError,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  defaultDefinitions: {},
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,

  chapters: {
    infoPages: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-details',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          scrollAndFocusTarget: focusH3,
          // initialData,
        },
        homeless: {
          title: 'Homelessness question',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        ...contactInfo,
      },
    },
    conditions: {
      title: 'Issues for review',
      pages: {
        filingDeadlines: {
          title: 'Filing deadlines',
          path: 'filing-deadlines',
          uiSchema: filingDeadlines.uiSchema,
          schema: filingDeadlines.schema,
          scrollAndFocusTarget: focusH3,
        },
        extensionRequest: {
          title: 'Request an extension',
          path: 'extension-request',
          uiSchema: extensionRequest.uiSchema,
          schema: extensionRequest.schema,
          scrollAndFocusTarget: focusH3,
        },
        extensionReason: {
          title: 'Reason for extension',
          path: 'extension-reason',
          depends: showExtensionReason,
          uiSchema: extensionReason.uiSchema,
          schema: extensionReason.schema,
          scrollAndFocusTarget: focusH3,
        },
        appealingVhaDenial: {
          title: 'Appealing denial of VA health care benefits',
          path: 'appealing-denial',
          uiSchema: appealingVhaDenial.uiSchema,
          schema: appealingVhaDenial.schema,
          scrollAndFocusTarget: focusH3,
        },
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
          scrollAndFocusTarget: focusH3,
        },
        addIssue: {
          title: 'Add issues for review',
          path: 'add-issue',
          depends: () => false, // accessed from contestableIssues page
          // showPagePerItem: true,
          // arrayPath: 'additionalIssues',
          CustomPage: AddContestableIssue,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
          returnUrl: `/${CONTESTABLE_ISSUES_PATH}`,
          scrollAndFocusTarget: focusH3,
        },
        areaOfDisagreementFollowUp: {
          title: getIssueTitle,
          path: 'area-of-disagreement/:index',
          CustomPage: AreaOfDisagreement,
          CustomPageReview: null,
          showPagePerItem: true,
          arrayPath: 'areaOfDisagreement',
          uiSchema: areaOfDisagreementFollowUp.uiSchema,
          schema: areaOfDisagreementFollowUp.schema,
          scrollAndFocusTarget: focusH3,
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
          scrollAndFocusTarget: focusH3,
        },
      },
    },
    boardReview: {
      title: 'Board review option',
      pages: {
        boardReviewOption: {
          // Adding trailing space so this title and chapter title are different
          // then the page header renders on the review & submit page, see:
          // https://github.com/department-of-veterans-affairs/vets-website/pull/29514#discussion_r1586347078
          title: 'Board review option ',
          path: 'board-review-option',
          uiSchema: boardReview.uiSchema,
          schema: boardReview.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
        evidenceIntro: {
          title: 'Additional evidence',
          path: 'evidence-submission',
          depends: canUploadEvidence,
          uiSchema: evidenceIntro.uiSchema,
          schema: evidenceIntro.schema,
          scrollAndFocusTarget: focusH3,
        },
        evidenceUpload: {
          title: 'Evidence upload',
          path: 'evidence-submission/upload',
          depends: wantsToUploadEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
          scrollAndFocusTarget: focusH3,
        },
        hearingType: {
          title: 'Hearing type',
          path: 'hearing-type',
          depends: needsHearingType,
          uiSchema: hearingType.uiSchema,
          schema: hearingType.schema,
          scrollAndFocusTarget: focusRadioH3,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
