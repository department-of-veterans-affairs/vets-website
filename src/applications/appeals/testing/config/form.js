import FormFooter from 'platform/forms/components/FormFooter';

import IntroductionPage from '../containers/IntroductionPage';
import veteranInfo from '../../10182/pages/veteranInfo';
import homeless from '../../10182/pages/homeless';
import contactInfo from '../../10182/pages/contactInfo';
import contestableIssues from '../../10182/pages/contestableIssues';
import addIssue from '../../10182/pages/addIssue';
import areaOfDisagreementFollowUp from '../../shared/pages/areaOfDisagreement';
import AreaOfDisagreement from '../../shared/components/AreaOfDisagreement';
import extensionRequest from '../../10182/pages/extensionRequest';
import extensionReason from '../../10182/pages/extensionReason';
import appealingVhaDenial from '../../10182/pages/appealingVhaDenial';
import filingDeadlines from '../../10182/pages/filingDeadlines';
import issueSummary from '../../10182/pages/issueSummary';
import boardReview from '../../10182/pages/boardReview';
import hearingType from '../../10182/pages/hearingType';
import evidenceIntro from '../../10182/pages/evidenceIntro';
import evidenceUpload from '../../10182/pages/evidenceUpload';
import ConfirmationPage from '../containers/ConfirmationPage';

import GetFormHelp from '../../10182/content/GetFormHelp';

import AddIssue from '../../10182/components/AddIssue';

import {
  canUploadEvidence,
  wantsToUploadEvidence,
  needsHearingType,
  showPart3,
  showExtensionReason,
} from '../../10182/utils/helpers';

import { CONTESTABLE_ISSUES_PATH } from '../../10182/constants';

import { getIssueTitle } from '../../shared/content/areaOfDisagreement';
import { appStateSelector } from '../../shared/utils/issues';

import initialData from '../../10182/tests/fixtures/data/maximal-test.json';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'appeals-testing-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM_MOCK_APPEALS',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Request a Board Appeal',
  subTitle: 'VA Form 10182 (Notice of Disagreement)',
  formOptions: {
    noTitle: true,
    noTopNav: true,
    noBottomNav: true,
    fullWidth: true,
  },

  defaultDefinitions: {},
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,

  chapters: {
    infoPages: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-details',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          initialData,
        },
        homeless: {
          title: 'Homelessness question',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
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
        },
        extensionRequest: {
          title: 'Request an extension',
          path: 'extension-request',
          depends: showPart3,
          uiSchema: extensionRequest.uiSchema,
          schema: extensionRequest.schema,
        },
        extensionReason: {
          title: 'Reason for extension',
          path: 'extension-reason',
          depends: showExtensionReason,
          uiSchema: extensionReason.uiSchema,
          schema: extensionReason.schema,
        },
        appealingVhaDenial: {
          title: 'Appealing denial of VA health care benefits',
          path: 'appealing-denial',
          depends: showPart3,
          uiSchema: appealingVhaDenial.uiSchema,
          schema: appealingVhaDenial.schema,
        },
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
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
          returnUrl: `/${CONTESTABLE_ISSUES_PATH}`,
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
