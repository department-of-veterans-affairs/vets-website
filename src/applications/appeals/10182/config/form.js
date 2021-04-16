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
} from '../utils/helpers';

// Pages
import veteranInfo from '../pages/veteranInfo';
import contactInfo from '../pages/contactInfo';
import homeless from '../pages/homeless';
import hasRep from '../pages/hasRep';
import repInfo from '../pages/repInfo';
import contestableIssues from '../pages/contestableIssues';
import boardReview from '../pages/boardReview';
import evidenceIntro from '../pages/evidenceIntro';
import evidenceUpload from '../pages/evidenceUpload';

// import initialData from '../tests/schema/initialData';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

import manifest from '../manifest.json';

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

  savedFormMessages: {
    notFound: 'Please start over to apply for a board appeal.',
    noAuth:
      'Please sign in again to continue your application for a board appeal.',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your Board Appeal application (10182) is in progress.',
      expired:
        'Your saved Board Appeal application (10182) has expired. If you want to request a Board Appeal, please start a new application.',
      saved: 'Your Board Appeal application has been saved.',
    },
  },

  introduction: IntroductionPage,
  confirmation: ConfirmationPage,

  defaultDefinitions: {},
  chapters: {
    infoPages: {
      title: 'Veteran information',
      reviewDescription: ReviewDescription,
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          // initialData,
        },
        confirmContactInformation: {
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
      },
    },
    hasRep: {
      title: 'Representation',
      pages: {
        hasRep: {
          title: 'Representative',
          path: 'representative',
          uiSchema: hasRep.uiSchema,
          schema: hasRep.schema,
        },
        repInfo: {
          title: 'Representative Information',
          path: 'representative-information',
          depends: hasRepresentative,
          uiSchema: repInfo.uiSchema,
          schema: repInfo.schema,
        },
      },
    },
    conditions: {
      title: 'Issues eligible for review',
      pages: {
        contestableIssues: {
          title: 'Issues eligible for review',
          path: 'eligible-issues',
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
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
          title: 'Additional evidence',
          path: 'additional-evidence',
          depends: canUploadEvidence,
          uiSchema: evidenceIntro.uiSchema,
          schema: evidenceIntro.schema,
        },
        evidenceUpload: {
          title: 'Additional evidence',
          path: 'additional-evidence/upload',
          depends: wantsToUploadEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
