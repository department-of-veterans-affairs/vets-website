import environment from 'platform/utilities/environment';
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
import GetFormHelp from '../content/GetFormHelp';
import ReviewDescription from '../components/ReviewDescription';
import {
  EditPhone,
  EditEmail,
  EditAddress,
} from '../components/EditContactInfo';
import AddIssue from '../components/AddIssue';

import {
  canUploadEvidence,
  wantsToUploadEvidence,
  needsHearingType,
  appStateSelector,
  getIssueName,
} from '../utils/helpers';

import { contestableIssuesPath } from '../constants';

// Pages
import veteranInfo from '../pages/veteranInfo';
import contactInfo from '../pages/contactInfo';
import homeless from '../pages/homeless';
import contestableIssues from '../pages/contestableIssues';
import addIssue from '../pages/addIssue';
import areaOfDisagreementFollowUp from '../pages/areaOfDisagreement';
import filingDeadlines from '../pages/filingDeadlines';
import issueSummary from '../pages/issueSummary';
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
  subTitle: 'VA Form 10182 (Notice of Disagreement)',

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
        homeless: {
          title: 'Homelessness question',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
        },
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
    conditions: {
      title: 'Issues for review',
      pages: {
        filingDeadlines: {
          title: 'Filing deadlines',
          path: 'filing-deadlines',
          uiSchema: filingDeadlines.uiSchema,
          schema: filingDeadlines.schema,
        },
        contestableIssues: {
          title: 'Issues eligible for review',
          path: contestableIssuesPath,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          appStateSelector,
        },
        addIssue: {
          title: 'Add issues for review',
          path: 'add-issue',
          depends: () => false, // accessed from contestableIssues page
          // showPagePerItem: true,
          // arrayPath: 'additionalIssues',
          CustomPage: AddIssue,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
        },
        areaOfDisagreementFollowUp: {
          title: getIssueName,
          path: 'area-of-disagreement/:index',
          showPagePerItem: true,
          arrayPath: 'areaOfDisagreement',
          uiSchema: areaOfDisagreementFollowUp.uiSchema,
          schema: areaOfDisagreementFollowUp.schema,
        },
        issueSummary: {
          title: 'Issue summary',
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
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
