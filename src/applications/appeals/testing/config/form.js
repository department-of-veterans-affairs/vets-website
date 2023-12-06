import FormFooter from 'platform/forms/components/FormFooter';

// import CustomPageWrapper from '../components/CustomPageWrapper';
import IntroductionPage from '../containers/IntroductionPage';
import taskList from '../pages/taskList';
import veteranInfo from '../pages/veteranInfo';

import homeless from '../pages/homeless';
import contactInfo from '../pages/contactInfo';
import {
  EditHomePhone,
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../components/EditContactInfo';
import primaryPhone from '../pages/primaryPhone';
import contestableIssues from '../pages/contestableIssues';
import addIssue from '../pages/addIssue';
import areaOfDisagreementFollowUp from '../pages/areaOfDisagreement';
import extensionRequest from '../pages/extensionRequest';
import extensionReason from '../pages/extensionReason';
import appealingVhaDenial from '../pages/appealingVhaDenial';
import filingDeadlines from '../pages/filingDeadlines';
import issueSummary from '../pages/issueSummary';
import additionalInfoRequest from '../pages/additionalInfoRequest';
import additionalInfo from '../pages/additionalInfo';
import additionalInfoUpload from '../pages/additionalInfoUpload';
import boardReview from '../pages/boardReview';
import hearingType from '../pages/hearingType';
import evidenceIntro from '../pages/evidenceIntro';
import evidenceUpload from '../pages/evidenceUpload';
import review from '../pages/review';
import ConfirmationPage from '../containers/ConfirmationPage';

import GetFormHelp from '../content/GetFormHelp';

import AreaOfDisagreement from '../components/AreaOfDisagreement';
import PrimaryPhone from '../components/PrimaryPhone';
import AddContestableIssue from '../components/AddContestableIssue';
import TaskList from '../components/TaskList';
import ReviewPage from '../components/ReviewPage';
import ReviewPage2 from '../components/ReviewPage2';

import {
  canUploadEvidence,
  wantsToUploadEvidence,
  needsHearingType,
  showExtensionReason,
} from '../../10182/utils/helpers';
import { scrollAndFocusTarget } from '../utils/focus';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';

import { getIssueTitle } from '../../shared/content/areaOfDisagreement';
import { appStateSelector } from '../../shared/utils/issues';

import mockData from '../tests/fixtures/data/test-data.json';

import manifest from '../manifest.json';

const blankSchema = { type: 'object', properties: {} };

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
    // noBottomNav: true,
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
        taskList: {
          title: 'Task List',
          taskListHide: true,
          path: 'task-list',
          CustomPage: TaskList,
          CustomPageReview: null,
          uiSchema: taskList.uiSchema,
          schema: taskList.schema,
          initialData: mockData.data,
          scrollAndFocusTarget,
        },
        veteranInformation: {
          title: 'Veteran information',
          taskListTitle: 'Personal information',
          path: 'veteran-details',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
          scrollAndFocusTarget,
        },
        homeless: {
          title: 'Homelessness',
          taskListTitle: 'Homeless status',
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
          review: homeless.review,
          scrollAndFocusTarget,
        },
        contactInfo: {
          title: 'Contact information',
          path: 'contact-information',
          // CustomPage: CustomPageWrapper,
          // CustomPageReview: null,
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
          review: contactInfo.review,
          scrollAndFocusTarget,
        },
        editHomePhone: {
          title: 'Edit home phone number',
          taskListHide: true,
          path: 'edit-home-phone',
          CustomPage: EditHomePhone,
          CustomPageReview: EditHomePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
          scrollAndFocusTarget,
        },
        editMobilePhone: {
          title: 'Edit mobile phone number',
          taskListHide: true,
          path: 'edit-mobile-phone',
          CustomPage: EditMobilePhone,
          CustomPageReview: EditMobilePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
          scrollAndFocusTarget,
        },
        editEmailAddress: {
          title: 'Edit email address',
          taskListHide: true,
          path: 'edit-email-address',
          CustomPage: EditEmail,
          CustomPageReview: EditEmail,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
          scrollAndFocusTarget,
        },
        editMailingAddress: {
          title: 'Edit mailing address',
          taskListHide: true,
          path: 'edit-mailing-address',
          CustomPage: EditAddress,
          CustomPageReview: EditAddress,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: blankSchema,
          scrollAndFocusTarget,
        },
        primaryContact: {
          title: 'Primary phone number',
          taskListTitle: 'Primary contact',
          path: 'primary-phone-number',
          CustomPage: PrimaryPhone,
          CustomPageReview: null,
          uiSchema: primaryPhone.uiSchema,
          schema: primaryPhone.schema,
          review: primaryPhone.review,
          scrollAndFocusTarget,
        },
      },
    },
    conditions: {
      title: 'Issues for review',
      pages: {
        filingDeadlines: {
          title: 'Filing deadlines',
          taskListTitle: 'Review deadlines and request an extension',
          path: 'filing-deadlines',
          uiSchema: filingDeadlines.uiSchema,
          schema: filingDeadlines.schema,
          scrollAndFocusTarget,
        },
        extensionRequest: {
          title: 'Request an extension',
          taskListHide: true,
          path: 'extension-request',
          uiSchema: extensionRequest.uiSchema,
          schema: extensionRequest.schema,
          review: extensionRequest.review,
          scrollAndFocusTarget,
        },
        extensionReason: {
          title: 'Reason for extension',
          taskListHide: true,
          path: 'extension-reason',
          depends: showExtensionReason,
          uiSchema: extensionReason.uiSchema,
          schema: extensionReason.schema,
          review: extensionReason.review,
          scrollAndFocusTarget,
        },
        appealingVhaDenial: {
          title: 'Appealing denial of VA health care benefits',
          taskListTitle: 'Denial of VA HealthCare',
          path: 'appealing-denial',
          uiSchema: appealingVhaDenial.uiSchema,
          schema: appealingVhaDenial.schema,
          review: appealingVhaDenial.review,
          scrollAndFocusTarget,
        },
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          taskListTitle: 'Select issues and provide reasons for disagreement',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssues.uiSchema,
          schema: contestableIssues.schema,
          scrollAndFocusTarget,
          appStateSelector,
        },
        addIssue: {
          title: 'Add issues for review',
          taskListHide: true,
          path: 'add-issue',
          depends: () => false, // accessed from contestableIssues page
          // showPagePerItem: true,
          // arrayPath: 'additionalIssues',
          CustomPage: AddContestableIssue,
          uiSchema: addIssue.uiSchema,
          schema: addIssue.schema,
          returnUrl: `/${CONTESTABLE_ISSUES_PATH}`,
          scrollAndFocusTarget,
        },
        areaOfDisagreementFollowUp: {
          title: getIssueTitle,
          taskListHide: true,
          path: 'area-of-disagreement/:index',
          CustomPage: AreaOfDisagreement,
          CustomPageReview: null,
          showPagePerItem: true,
          arrayPath: 'areaOfDisagreement',
          uiSchema: areaOfDisagreementFollowUp.uiSchema,
          schema: areaOfDisagreementFollowUp.schema,
          review: areaOfDisagreementFollowUp.review,
          scrollAndFocusTarget,
        },
        issueSummary: {
          title: 'Issue summary',
          taskListHide: true,
          path: 'issue-summary',
          uiSchema: issueSummary.uiSchema,
          schema: issueSummary.schema,
          scrollAndFocusTarget,
        },
        additionalInfoRequest: {
          title: 'Additional information',
          taskListTitle: 'Additional information',
          path: 'additional-info-request',
          uiSchema: additionalInfoRequest.uiSchema,
          schema: additionalInfoRequest.schema,
          review: additionalInfoRequest.review,
          scrollAndFocusTarget,
        },
        additionalInfo: {
          title: 'Add additional information',
          taskListHide: true,
          path: 'additional-info',
          depends: formData => formData['view:additionalInfo'],
          uiSchema: additionalInfo.uiSchema,
          schema: additionalInfo.schema,
          review: additionalInfo.review,
          scrollAndFocusTarget,
        },
        additionalInfoUpload: {
          title: 'Upload additional information',
          taskListHide: true,
          path: 'additional-info-upload',
          depends: formData => formData['view:additionalInfo'],
          uiSchema: additionalInfoUpload.uiSchema,
          schema: additionalInfoUpload.schema,
          review: additionalInfoUpload.review,
          scrollAndFocusTarget,
        },
      },
    },
    boardReview: {
      title: 'Board review option',
      pages: {
        boardReviewOption: {
          title: 'Board review option',
          taskListTitle: 'Select review option',
          path: 'board-review-option',
          uiSchema: boardReview.uiSchema,
          schema: boardReview.schema,
          review: boardReview.review,
          scrollAndFocusTarget,
        },
        evidenceIntro: {
          title: 'Evidence submission',
          taskListHide: true,
          path: 'evidence-submission',
          depends: canUploadEvidence,
          uiSchema: evidenceIntro.uiSchema,
          schema: evidenceIntro.schema,
          review: evidenceIntro.review,
          scrollAndFocusTarget,
        },
        evidenceUpload: {
          title: 'Evidence upload',
          taskListHide: true,
          path: 'evidence-submission/upload',
          depends: wantsToUploadEvidence,
          uiSchema: evidenceUpload.uiSchema,
          schema: evidenceUpload.schema,
          review: evidenceUpload.review,
          scrollAndFocusTarget,
        },
        hearingType: {
          title: 'Hearing type',
          taskListHide: true,
          path: 'hearing-type',
          depends: needsHearingType,
          uiSchema: hearingType.uiSchema,
          schema: hearingType.schema,
          review: hearingType.review,
          scrollAndFocusTarget,
        },
      },
    },
    reviewApp: {
      title: 'Apply',
      pages: {
        reviewAndSubmit: {
          title: 'Review and submit',
          path: 'review-then-submit',
          CustomPage: ReviewPage,
          CustomPageReview: null,
          uiSchema: review.uiSchema,
          schema: review.schema,
          scrollAndFocusTarget,
        },
        reviewAndSubmit2: {
          title: 'Review and submit',
          taskListHide: true,
          path: 'review-then-submit2',
          depends: () => false,
          CustomPage: ReviewPage2,
          CustomPageReview: null,
          uiSchema: review.uiSchema,
          schema: review.schema,
          scrollAndFocusTarget,
        },
        confirmation: {
          title: 'Confirmation page',
          taskListHide: true,
          path: 'confirmation',
          CustomPage: ConfirmationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
          scrollAndFocusTarget,
        },
      },
    },
  },

  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
