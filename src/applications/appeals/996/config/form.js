import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices as services } from 'platform/monitoring/DowntimeNotification';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';

// Components
import AddIssue from '../../shared/components/AddIssue';
import AreaOfDisagreement from '../../shared/components/AreaOfDisagreement';
import ConfirmationPage from '../containers/ConfirmationPage';
import InformalConference from '../components/InformalConference';
import InformalConferenceContact from '../components/InformalConferenceContact';
import InformalConferenceReview from '../components/InformalConferenceReview';
import IntroductionPage from '../containers/IntroductionPage';
import SubTaskContainer from '../subtask/SubTaskContainer';

// Pages
import addIssue from '../../shared/pages/addIssue';
import areaOfDisagreementFollowUp from '../../shared/pages/areaOfDisagreement';
import authorization from '../pages/authorization';
import contactInfo from '../pages/contactInformation';
import contestableIssuesPage from '../pages/contestableIssues';
import homeless from '../pages/homeless';
import informalConference from '../pages/informalConferenceChoice';
import informalConferenceContact from '../pages/informalConference';
import InformalConferenceContactReview from '../components/InformalConferenceContactReview';
import informalConferenceRepV2 from '../pages/informalConferenceRep';
import informalConferenceTime from '../pages/informalConferenceTime';
import informalConferenceTimeRep from '../pages/informalConferenceTimeRep';
import issueSummary from '../pages/issueSummary';
import veteranInformation from '../pages/veteranInformation';

// Content
import { homelessPageTitle } from '../content/homeless';
import { formTitle, subTitle } from '../content/title';
import GetFormHelp from '../../shared/content/GetFormHelp';
import submissionError from '../../shared/content/submissionError';
import { getIssueTitle } from '../../shared/content/areaOfDisagreement';
import reviewErrors from '../../shared/content/reviewErrors';

// Utils
import manifest from '../manifest.json';
import migrations from '../migrations';
import prefillTransformer from './prefill-transformer';
import { transform } from './submit-transformer';
import submitForm from './submitForm';
import { errorMessages, ADD_ISSUE_PATH } from '../constants';
import { SUBMIT_URL } from '../constants/apis';
import {
  onFormLoaded,
  showConferenceContact,
  showConferenceVeteranPage,
  showConferenceRepPages,
} from '../utils/helpers';
import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { appStateSelector } from '../../shared/utils/issues';
import { focusH3, focusOnAlert, focusIssue } from '../../shared/utils/focus';
// import initialData from '../tests/initialData';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
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

  formId: VA_FORM_IDS.FORM_20_0996,
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

  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  transformForSubmit: transform,
  onFormLoaded,
  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },

  title: formTitle,
  subTitle,
  defaultDefinitions: {},
  preSubmitInfo,
  submissionError,
  // showReviewErrors: true,
  reviewErrors,

  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  scrollAndFocusTarget: focusH3, // scroll and focus fallback
  reviewEditFocusOnHeaders: true,
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,

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
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
          // initialData,
        },
        homeless: {
          title: homelessPageTitle,
          path: 'homeless',
          uiSchema: homeless.uiSchema,
          schema: homeless.schema,
          scrollAndFocusTarget: focusH3,
        },
        ...contactInfo,
      },
    },
    issues: {
      title: 'Issues for review',
      pages: {
        // v2 - show contested + added issues
        contestableIssues: {
          title: 'You’ve selected these issues for review',
          path: CONTESTABLE_ISSUES_PATH,
          uiSchema: contestableIssuesPage.uiSchema,
          schema: contestableIssuesPage.schema,
          appStateSelector,
          scrollAndFocusTarget: focusIssue,
          onContinue: focusOnAlert,
        },
        // v2 - add issue. Accessed from contestableIssues page only
        addIssue: {
          title: 'Add issues for review',
          path: ADD_ISSUE_PATH,
          depends: () => false,
          CustomPage: props => AddIssue(props, 'HLR'),
          uiSchema: addIssue().uiSchema,
          schema: addIssue().schema,
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
        authorization: {
          title: 'Authorization',
          path: 'authorization',
          uiSchema: authorization.uiSchema,
          schema: authorization.schema,
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
          // original page choices: 'me', 'rep' or 'no'
          // new page choices: 'yes' or 'no'
          CustomPage: InformalConference,
          CustomPageReview: InformalConferenceReview,
          scrollAndFocusTarget: focusH3,
        },
        conferenceContact: {
          path: 'informal-conference/contact',
          title: 'Scheduling your informal conference',
          depends: showConferenceContact,
          uiSchema: informalConferenceContact.uiSchema,
          schema: informalConferenceContact.schema,
          // new page choices: 'me' or 'rep'
          CustomPage: InformalConferenceContact,
          CustomPageReview: InformalConferenceContactReview,
        },
        representativeInfoV2: {
          // changing path from v1, but this shouldn't matter since the
          // migration code returns the Veteran to the contact info page
          path: 'informal-conference/representative-info',
          title: 'Representative’s information',
          depends: showConferenceRepPages,
          uiSchema: informalConferenceRepV2.uiSchema,
          schema: informalConferenceRepV2.schema,
        },
        conferenceTime: {
          path: 'informal-conference/conference-availability',
          title: 'Scheduling availability',
          depends: showConferenceVeteranPage,
          uiSchema: informalConferenceTime.uiSchema,
          schema: informalConferenceTime.schema,
        },
        conferenceTimeRep: {
          path: 'informal-conference/conference-rep-availability',
          title: 'Scheduling availability',
          depends: showConferenceRepPages,
          uiSchema: informalConferenceTimeRep.uiSchema,
          schema: informalConferenceTimeRep.schema,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
