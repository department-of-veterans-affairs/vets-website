import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import transform from './submit-transformer';
import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  TITLE,
  SUBTITLE,
  STATEMENT_TYPES,
  DECISION_REVIEW_TYPES,
} from './constants';
import { statementTypePage } from '../pages/statementType';
import { layWitnessStatementPage } from '../pages/layOrWitness';
import {
  decisionReviewPage,
  selectDecisionReviewPage,
} from '../pages/decisionReview';
import {
  newSupplementalClaimPage,
  supplementalClaimPage,
  higherLevelReviewPage,
  boardAppealPage,
} from '../pages/noticeOfDisagreement';
import {
  aboutPriorityProcessingPage,
  housingRisksPage,
  otherHousingRisksPage,
  hardshipsPage,
  priorityProcessingNotQualifiedPage,
  priorityProcessingRequestPage,
} from '../pages/priorityProcessing';
import { personalRecordsRequestPage } from '../pages/recordsRequest';
import { claimStatusToolPage } from '../pages/newEvidence';
import { personalInformationPage } from '../pages/personalInformation';
import { identificationInformationPage } from '../pages/identificationInfo';
import { mailingAddressPage } from '../pages/mailingAddress';
import { contactInformationPage } from '../pages/phoneAndEmail';
import { statementPage } from '../pages/statement';
import {
  getMockData,
  isEligibleForDecisionReview,
  isIneligibleForPriorityProcessing,
  isEligibleToSubmitStatement,
} from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/user.json';
import { CustomTopContent } from '../components/breadcrumbs';
import {
  focusByOrder,
  scrollTo,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';

const mockData = testData.data;

/** @type {FormConfig} */
const minimalFlowProps = {
  CustomTopContent,
  hideFormTitle: true,
  showSaveLinkAfterButtons: true,
  useCustomScrollAndFocus: true,
  useTopBackLink: true,
  v3SegmentedProgressBar: {
    useDiv: true,
  },
  scrollAndFocusTarget: () => {
    setTimeout(() => {
      scrollTo('header-minimal');
      const radio = document.querySelector('va-radio[label-header-level]');
      const checkboxGroup = document.querySelector(
        'va-checkbox-group[label-header-level]',
      );
      if (radio) {
        waitForRenderThenFocus('h1', radio.shadowRoot);
      } else if (checkboxGroup) {
        waitForRenderThenFocus('h1', checkboxGroup.shadowRoot);
      } else {
        focusByOrder(['h1', 'va-segmented-progress-bar']);
      }
    }, 200);
  },
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  transformForSubmit: transform,
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'ss-4138-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4138',
  saveInProgress: {
    messages: {
      inProgress:
        'Your statement in support of a claim application (21-4138) is in progress.',
      expired:
        'Your saved statement in support of a claim application (21-4138) has expired. If you want to apply for statement in support of a claim, please start a new application.',
      saved: 'Your statement in support of a claim application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  // TODO: Change hideUnauthedStartLink to true. This form is meant to be for authenticated users only.
  hideUnauthedStartLink: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for statement in support of a claim.',
    noAuth:
      'Please sign in again to continue your application for statement in support of a claim.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  ...minimalFlowProps,
  chapters: {
    statementTypeChapter: {
      title: 'What kind of statement do you want to submit?',
      hideFormNavProgress: true,
      hideOnReviewPage: true,
      pages: {
        statementTypePage: {
          path: 'statement-type',
          title: 'Statement type',
          uiSchema: statementTypePage.uiSchema,
          schema: statementTypePage.schema,
          pageClass: 'statement-type',
          // we want required fields prefilled for LOCAL testing/previewing one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
          hideSaveLinkAndStatus: true,
        },
        layWitnessStatementPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.BUDDY_STATEMENT,
          path: 'lay-witness-statement',
          title: "There's a better way to submit your statement to us",
          uiSchema: layWitnessStatementPage.uiSchema,
          schema: layWitnessStatementPage.schema,
          pageClass: 'lay-witness-statement',
          hideNavButtons: true,
        },
        decisionReviewPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW,
          path: 'decision-review',
          title: 'What to know before you request a decision review',
          uiSchema: decisionReviewPage.uiSchema,
          schema: decisionReviewPage.schema,
          pageClass: 'decision-review',
          hideSaveLinkAndStatus: true,
        },
        newSupplementalClaimPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            !isEligibleForDecisionReview(formData.decisionDate),
          path: 'new-supplemental-claim',
          title: 'What to know before you request a decision review',
          uiSchema: newSupplementalClaimPage.uiSchema,
          schema: newSupplementalClaimPage.schema,
          pageClass: 'new-supplemental-claim',
          hideNavButtons: true,
        },
        selectDecisionReviewPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate),
          path: 'select-decision-review',
          title: 'Which description is true for you?',
          uiSchema: selectDecisionReviewPage.uiSchema,
          schema: selectDecisionReviewPage.schema,
          pageClass: 'select-decision-review',
          hideSaveLinkAndStatus: true,
        },
        supplementalClaimPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.NEW_EVIDENCE,
          path: 'supplemental-claim',
          title: 'What to know before you request a decision review',
          uiSchema: supplementalClaimPage.uiSchema,
          schema: supplementalClaimPage.schema,
          pageClass: 'supplemental-claim',
          hideNavButtons: true,
          hideSaveLinkAndStatus: true,
        },
        higherLevelReviewPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.ERROR_MADE,
          path: 'higher-level-review',
          title: "There's a better way for you to ask for a decision review",
          uiSchema: higherLevelReviewPage.uiSchema,
          schema: higherLevelReviewPage.schema,
          pageClass: 'higher-level-review',
          hideNavButtons: true,
        },
        boardAppealPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.BVA_REQUEST,
          path: 'board-appeal',
          title: "There's a better way for you to ask for a decision review",
          uiSchema: boardAppealPage.uiSchema,
          schema: boardAppealPage.schema,
          pageClass: 'board-appeal',
          hideNavButtons: true,
        },
        aboutPriorityProcessingPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'about-priority-processing',
          title: 'What to know before you request priority processing',
          uiSchema: aboutPriorityProcessingPage.uiSchema,
          schema: aboutPriorityProcessingPage.schema,
          pageClass: 'about-priority-processing',
          hideSaveLinkAndStatus: true,
        },
        housingRisksPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'housing-risks',
          title:
            'Which of these statements best describes your living situation?',
          uiSchema: housingRisksPage.uiSchema,
          schema: housingRisksPage.schema,
          pageClass: 'housing-risks',
          hideSaveLinkAndStatus: true,
        },
        otherHousingRisksPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            formData.livingSituation.OTHER_RISK,
          path: 'other-housing-risk',
          title: 'Other housing risks',
          uiSchema: otherHousingRisksPage.uiSchema,
          schema: otherHousingRisksPage.schema,
          pageClass: 'other-housing-risk',
          hideSaveLinkAndStatus: true,
        },
        hardshipsPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'hardships',
          title: 'Other reasons for request',
          uiSchema: hardshipsPage.uiSchema,
          schema: hardshipsPage.schema,
          pageClass: 'hardships',
          hideSaveLinkAndStatus: true,
        },
        priorityProcessingNotQualifiedPage: {
          depends: formData => isIneligibleForPriorityProcessing(formData),
          path: 'priority-processing-not-qualified',
          title: 'You may not qualify for priority processing',
          uiSchema: priorityProcessingNotQualifiedPage.uiSchema,
          schema: priorityProcessingNotQualifiedPage.schema,
          pageClass: 'priority-processing-not-qualified',
          hideSaveLinkAndStatus: true,
        },
        priorityProcessingRequestPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            (!formData.livingSituation.NONE ||
              (formData.livingSituation.NONE && !formData.otherReasons?.NONE)),
          path: 'priority-processing-request',
          title: "There's a better way to request priority processing",
          uiSchema: priorityProcessingRequestPage.uiSchema,
          schema: priorityProcessingRequestPage.schema,
          pageClass: 'priority-processing-request',
          hideNavButtons: true,
        },
        personalRecordsRequestPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PERSONAL_RECORDS,
          path: 'personal-records-request',
          title: "There's a better way to request your personal records",
          uiSchema: personalRecordsRequestPage.uiSchema,
          schema: personalRecordsRequestPage.schema,
          pageClass: 'personal-records-request',
          hideNavButtons: true,
        },
        claimStatusToolPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NEW_EVIDENCE,
          path: 'claim-status-tool',
          title: "There's a better way to submit new evidence",
          uiSchema: claimStatusToolPage.uiSchema,
          schema: claimStatusToolPage.schema,
          pageClass: 'claim-status-tool',
          hideNavButtons: true,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformationPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'personal-information',
          title: 'Name and date of birth',
          uiSchema: personalInformationPage.uiSchema,
          schema: personalInformationPage.schema,
          pageClass: 'personal-information',
        },
      },
    },
    identificationChapter: {
      title: 'Your identification information',
      pages: {
        identificationInformationPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformationPage.uiSchema,
          schema: identificationInformationPage.schema,
          pageClass: 'identification-information',
        },
      },
    },
    mailingAddressChapter: {
      title: 'Your mailing address',
      pages: {
        mailingAddressPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddressPage.uiSchema,
          schema: mailingAddressPage.schema,
          pageClass: 'mailing-address',
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        contactInformationPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'contact-information',
          title: 'Phone and email address',
          uiSchema: contactInformationPage.uiSchema,
          schema: contactInformationPage.schema,
          pageClass: 'contact-information',
        },
      },
    },
    statementChapter: {
      title: 'Your statement',
      pages: {
        statementPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'statement',
          title: 'Your statement',
          uiSchema: statementPage.uiSchema,
          schema: statementPage.schema,
          pageClass: 'statement',
        },
      },
    },
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'fullName',
      checkboxLabel:
        'I confirm that the information above is correct and true to the best of my knowledge and belief.',
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
