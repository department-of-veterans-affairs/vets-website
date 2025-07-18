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
import SubTaskContainer from '../subtask/SubTaskContainer';

// Pages
import veteranInformation from '../pages/veteranInformation';
import homeless from '../pages/homeless';
import contactInfo from '../pages/contactInformation';
import contestableIssuesPage from '../pages/contestableIssues';
import addIssue from '../pages/addIssue';
import areaOfDisagreementFollowUp from '../pages/areaOfDisagreement';
import AreaOfDisagreement from '../../../shared/components/AreaOfDisagreement';
import optIn from '../pages/optIn';
import issueSummary from '../pages/issueSummary';
import informalConference from '../pages/informalConference';
import informalConferenceRepV2 from '../pages/informalConferenceRep';
import informalConferenceTime from '../pages/informalConferenceTime';
import informalConferenceTimeRep from '../pages/informalConferenceTimeRep';

import { errorMessages, ADD_ISSUE_PATH } from '../constants';
import { mayHaveLegacyAppeals } from '../utils/helpers';
import NeedHelp from '../content/NeedHelp';
import { formTitle, formSubTitle } from '../content/title';

import submissionError from '../../../shared/content/submissionError';
import { getIssueTitle } from '../../../shared/content/areaOfDisagreement';
import { CONTESTABLE_ISSUES_PATH } from '../../../shared/constants';
import { appStateSelector } from '../../../shared/utils/issues';
import reviewErrors from '../../../shared/content/reviewErrors';
import {
  focusH3OrRadioError,
  focusH3,
  focusIssue,
} from '../../../shared/utils/focus';

// import initialData from '../tests/initialData';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: 'higher_level_reviews',
  submit: submitForm,
  trackingPrefix: 'decision-reviews-va20-0996-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.vaProfile, // for contact info
      services.mvi, // contestable issues
      services.appeals, // LOA3 & SSN
    ],
  },

  formId: 'FORM_MOCK_HLR',
  saveInProgress: {
    messages: {
      inProgress:
        'Your Higher-Level Review application (20-0996) is in progress.',
      expired:
        'Your saved Higher-Level Review application (20-0996) has expired. If you want to apply for Higher-Level Review, please start a new application.',
      saved: 'Your Higher-Level Review application has been saved.',
    },
    // return restart destination url
    restartFormCallback: () => '/', // introduction page
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formOptions: {
    focusOnAlertRole: true,
  },

  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,

  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },

  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },

  title: formTitle,
  subTitle: formSubTitle,
  defaultDefinitions: {},
  preSubmitInfo,
  submissionError,
  // showReviewErrors: true,
  reviewErrors,

  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  scrollAndFocusTarget: focusH3, // scroll and focus fallback
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,

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
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
          // initialData,
        },
        homeless: {
          title: 'Housing situation',
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
        // v2 - show contested + added issues
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssuesPage.uiSchema,
          schema: contestableIssuesPage.schema,
          scrollAndFocusTarget: focusIssue,
          appStateSelector,
        },
        // v2 - add issue. Accessed from contestableIssues page only
        addIssue: {
          title: 'Add issues for review',
          path: ADD_ISSUE_PATH,
          depends: () => false,
          // showPagePerItem: true,
          // arrayPath: 'additionalIssues',
          CustomPage: AddContestableIssue,
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
    informalConference: {
      title: 'Informal conference',
      pages: {
        requestConference: {
          path: 'informal-conference',
          title: 'Request an informal conference',
          uiSchema: informalConference.uiSchema,
          schema: informalConference.schema,
          scrollAndFocusTarget: focusH3OrRadioError,
        },
        representativeInfoV2: {
          // changing path from v1, but this shouldn't matter since the
          // migration code returns the Veteran to the contact info page
          path: 'informal-conference/representative-info',
          title: 'Representative’s information',
          depends: formData => formData?.informalConference === 'rep',
          uiSchema: informalConferenceRepV2.uiSchema,
          schema: informalConferenceRepV2.schema,
        },
        conferenceTime: {
          path: 'informal-conference/conference-availability',
          title: 'Scheduling availability',
          depends: formData => formData?.informalConference === 'me',
          uiSchema: informalConferenceTime.uiSchema,
          schema: informalConferenceTime.schema,
        },
        conferenceTimeRep: {
          path: 'informal-conference/conference-rep-availability',
          title: 'Scheduling availability',
          depends: formData => formData?.informalConference === 'rep',
          uiSchema: informalConferenceTimeRep.uiSchema,
          schema: informalConferenceTimeRep.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: NeedHelp,
};

export default formConfig;
