import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

import migrations from '../migrations';
import prefillTransformer from '../config/prefill-transformer';
import { transform } from '../config/submit-transformer';
import submitForm from '../config/submitForm';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../content/GetFormHelp';
import ReviewDescription from '../components/ReviewDescription';

import {
  hasRepresentative,
  canUploadEvidence,
  wantsToUploadEvidence,
  showAddIssueQuestion,
  showAddIssues,
  needsHearingType,
  appStateSelector,
} from '../utils/helpers';

// Pages
import veteranInfo from '../pages/veteranInfo';
import contactInfo from '../pages/contactInfo';
import homeless from '../pages/homeless';
import hasRep from '../pages/hasRep';
import repInfo from '../pages/repInfo';
import contestableIssues from '../pages/contestableIssues';
import additionalIssuesIntro from '../pages/additionalIssuesIntro';
import additionalIssues from '../pages/additionalIssues';
import boardReview from '../pages/boardReview';
import evidenceIntro from '../pages/evidenceIntro';
import evidenceUpload from '../pages/evidenceUpload';

import {
  customText,
  saveInProgress,
  savedFormMessages,
} from '../content/saveInProgress';

// import initialData from '../tests/schema/initialData';

import manifest from '../manifest.json';
import hearingType from '../pages/hearingType';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/notice_of_disagreements`,
  trackingPrefix: '10182-board-appeal-',

  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile,
      services.bgs,
      services.mvi,
      services.appeals,
    ],
  },

  formId: VA_FORM_IDS.FORM_10182,
  version: migrations.length - 1,
  title: 'Request a Board Appeal',
  subTitle: 'Equal to VA Form 10182 (Notice of Disagreement)',

  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,
  preSubmitInfo,
  submit: submitForm,

  // SaveInProgress messages
  customText,
  savedFormMessages,
  saveInProgress,
  // errorText: '',
  // submissionError: '',

  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  defaultDefinitions: {},
  chapters: {
    infoPages: {
      title: 'Veteran details',
      reviewDescription: ReviewDescription,
      pages: {
        veteranInformation: {
          title: 'Veteran details',
          path: 'veteran-details',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          // initialData,
        },
        contactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
        homeless: {
          title: 'Homeless',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
        },
        hasRep: {
          title: 'Representative',
          path: 'representative',
          uiSchema: hasRep.uiSchema,
          schema: hasRep.schema,
        },
        repInfo: {
          title: 'Representative info',
          path: 'representative-info',
          depends: hasRepresentative,
          uiSchema: repInfo.uiSchema,
          schema: repInfo.schema,
        },
      },
    },
    conditions: {
      title: 'Issues for review',
      pages: {
        contestableIssues: {
          title: 'Issues eligible for review',
          path: 'eligible-issues',
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
        },
        additionalIssuesIntro: {
          title: 'Additional issues for review',
          path: 'additional-issues-intro',
          depends: showAddIssueQuestion,
          uiSchema: additionalIssuesIntro.uiSchema,
          schema: additionalIssuesIntro.schema,
          appStateSelector,
        },
        additionalIssues: {
          title: 'Add issues for review',
          path: 'additional-issues',
          depends: showAddIssues,
          uiSchema: additionalIssues.uiSchema,
          schema: additionalIssues.schema,
          appStateSelector,
          initialData: {
            'view:hasIssuesToAdd': true,
            additionalIssues: [{}],
          },
        },
      },
    },
    boardReview: {
      title: 'Board review option',
      pages: {
        boardReviewOption: {
          title: 'Board review option',
          path: 'board-review-option',
          uiSchema: boardReview.uiSchema,
          schema: boardReview.schema,
        },
        evidenceIntro: {
          title: 'Evidence submission',
          path: 'evidence-submission',
          depends: canUploadEvidence,
          uiSchema: evidenceIntro.uiSchema,
          schema: evidenceIntro.schema,
        },
        evidenceUpload: {
          title: 'Evidence upload',
          path: 'evidence-submission/upload',
          depends: wantsToUploadEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
        hearingType: {
          title: 'Hearing type',
          path: 'hearing-type',
          depends: needsHearingType,
          uiSchema: hearingType.uiSchema,
          schema: hearingType.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
