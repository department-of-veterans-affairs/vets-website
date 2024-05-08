import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  TITLE,
  SUBTITLE,
  STATEMENT_TYPES,
  DECISION_REVIEW_TYPES,
  LIVING_SITUATIONS,
  OTHER_REASONS_REQUIRED,
} from './constants';
import { statementTypePage } from '../pages/statementType';
import { layOrWitnessHandoffPage } from '../pages/layOrWitness';
import {
  decisionReviewPage,
  decisionReviewTypePage,
} from '../pages/decisionReview';
import {
  nodOldHandoffPage,
  nodSupplementalHandoffPage,
  nodHLRHandoffPage,
  nodBAHandoffPage,
} from '../pages/noticeOfDisagreement';
import {
  ppIntroPage,
  ppLivingSituationPage,
  ppOtherHousingRisksPage,
  ppOtherReasonsOptionalPage,
  ppOtherReasonsRequiredPage,
  ppNotQualifiedPage,
  ppQualifiedHandoffPage,
} from '../pages/priorityProcessing';
import { recordsRequestHandoffPage } from '../pages/recordsRequest';
import { newEvidenceHandoffPage } from '../pages/newEvidence';
import { vreRequestHandoffPage } from '../pages/vreRequest';
import { nameAndDateOfBirthPage } from '../pages/nameAndDateOfBirth';
import { identificationInformationPage } from '../pages/identificationInfo';
import { mailingAddressPage } from '../pages/mailingAddress';
import { phoneAndEmailPage } from '../pages/phoneAndEmail';
import { statementPage } from '../pages/statement';
import { getMockData, isEligibleForDecisionReview } from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/user.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
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
  hideUnauthedStartLink: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for statement in support of a claim.',
    noAuth:
      'Please sign in again to continue your application for statement in support of a claim.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    statementTypeChapter: {
      title: 'What kind of statement do you want to submit?',
      hideFormNavProgress: true,
      hideFormTitle: true,
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
        },
        layOrWitnessHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.BUDDY_STATEMENT,
          path: 'lay-or-witness-handoff',
          title: "There's a better way to submit your statement to us",
          uiSchema: layOrWitnessHandoffPage.uiSchema,
          schema: layOrWitnessHandoffPage.schema,
          pageClass: 'lay-or-witness-handoff',
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
        },
        noticeOfDisagreementOldHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            !isEligibleForDecisionReview(formData.decisionDate),
          path: 'notice-of-disagreement-old-handoff',
          title: 'What to know before you request a decision review',
          uiSchema: nodOldHandoffPage.uiSchema,
          schema: nodOldHandoffPage.schema,
          pageClass: 'notice-of-disagreement-old-handoff',
          hideNavButtons: true,
        },
        decisionReviewTypePage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate),
          path: 'decision-review-type',
          title: 'Which description is true for you?',
          uiSchema: decisionReviewTypePage.uiSchema,
          schema: decisionReviewTypePage.schema,
          pageClass: 'decision-review-type',
        },
        noticeOfDisagreementSupplementalHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.NEW_EVIDENCE,
          path: 'notice-of-disagreement-supplemental-handoff',
          title: 'What to know before you request a decision review',
          uiSchema: nodSupplementalHandoffPage.uiSchema,
          schema: nodSupplementalHandoffPage.schema,
          pageClass: 'notice-of-disagreement-supplemental-handoff',
          hideNavButtons: true,
        },
        noticeOfDisagreementHLRHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.ERROR_MADE,
          path: 'notice-of-disagreement-hlr-handoff',
          title: "There's a better way for you to ask for a decision review",
          uiSchema: nodHLRHandoffPage.uiSchema,
          schema: nodHLRHandoffPage.schema,
          pageClass: 'notice-of-disagreement-hlr-handoff',
          hideNavButtons: true,
        },
        noticeOfDisagreementBAHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW &&
            isEligibleForDecisionReview(formData.decisionDate) &&
            formData.decisionReviewType === DECISION_REVIEW_TYPES.BVA_REQUEST,
          path: 'notice-of-disagreement-ba-handoff',
          title: "There's a better way for you to ask for a decision review",
          uiSchema: nodBAHandoffPage.uiSchema,
          schema: nodBAHandoffPage.schema,
          pageClass: 'notice-of-disagreement-ba-handoff',
          hideNavButtons: true,
        },
        priorityProcessingIntroPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'priority-processing-intro',
          title: 'What to know before you request priority processing',
          uiSchema: ppIntroPage.uiSchema,
          schema: ppIntroPage.schema,
          pageClass: 'priority-processing-intro',
        },
        priorityProcessingLivingSituationPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'priority-processing-living-situation',
          title:
            'Which of these statements best describes your living situation?',
          uiSchema: ppLivingSituationPage.uiSchema,
          schema: ppLivingSituationPage.schema,
          pageClass: 'priority-processing-living-situation',
        },
        priorityProcessingOtherHousingRiskPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            formData.livingSituation === LIVING_SITUATIONS.OTHER_RISK,
          path: 'priority-processing-other-housing-risks',
          title: 'Other housing risks',
          uiSchema: ppOtherHousingRisksPage.uiSchema,
          schema: ppOtherHousingRisksPage.schema,
          pageClass: 'priority-processing-other-housing-risks',
        },
        priorityProcessingOtherReasonsOptionalPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            formData.livingSituation !== LIVING_SITUATIONS.NONE,
          path: 'priority-processing-other-reasons-optional',
          title: 'Other reasons for request',
          uiSchema: ppOtherReasonsOptionalPage.uiSchema,
          schema: ppOtherReasonsOptionalPage.schema,
          pageClass: 'priority-processing-other-reasons-optional',
        },
        priorityProcessingOtherReasonsRequiredPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            formData.livingSituation === LIVING_SITUATIONS.NONE,
          path: 'priority-processing-other-reasons',
          title: 'Other reasons for request',
          uiSchema: ppOtherReasonsRequiredPage.uiSchema,
          schema: ppOtherReasonsRequiredPage.schema,
          pageClass: 'priority-processing-other-reasons',
        },
        priorityProcessingNotQualifiedPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            (formData.livingSituation === LIVING_SITUATIONS.NONE &&
              formData.otherReasons === OTHER_REASONS_REQUIRED.NONE),
          path: 'priority-processing-not-qualified',
          title: 'You may not qualify for priority processing',
          uiSchema: ppNotQualifiedPage.uiSchema,
          schema: ppNotQualifiedPage.schema,
          pageClass: 'priority-processing-not-qualified',
        },
        priorityProcessingQualifiedHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
            (formData.livingSituation !== LIVING_SITUATIONS.NONE ||
              (formData.livingSituation === LIVING_SITUATIONS.NONE &&
                formData.otherReasons !== OTHER_REASONS_REQUIRED.NONE)),
          path: 'priority-processing-qualified-handoff',
          title: "There's a better way to request priority processing",
          uiSchema: ppQualifiedHandoffPage.uiSchema,
          schema: ppQualifiedHandoffPage.schema,
          pageClass: 'priority-processing-qualified-handoff',
          hideNavButtons: true,
        },
        recordsRequestHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PERSONAL_RECORDS,
          path: 'records-request-handoff',
          title: "There's a better way to request your personal records",
          uiSchema: recordsRequestHandoffPage.uiSchema,
          schema: recordsRequestHandoffPage.schema,
          pageClass: 'records-request-handoff',
          hideNavButtons: true,
        },
        newEvidenceHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NEW_EVIDENCE,
          path: 'new-evidence-handoff',
          title: "There's a better way to submit new evidence",
          uiSchema: newEvidenceHandoffPage.uiSchema,
          schema: newEvidenceHandoffPage.schema,
          pageClass: 'new-evidence-handoff',
          hideNavButtons: true,
        },
        vreRequestHandoffPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.VRE_REQUEST,
          path: 'vre-request-handoff',
          title: "There's a better way to request Chapter 31 support",
          uiSchema: vreRequestHandoffPage.uiSchema,
          schema: vreRequestHandoffPage.schema,
          pageClass: 'vre-request-handoff',
          hideNavButtons: true,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      hideFormTitle: true,
      pages: {
        nameAndDateOfBirthPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirthPage.uiSchema,
          schema: nameAndDateOfBirthPage.schema,
          pageClass: 'name-and-date-of-birth',
        },
      },
    },
    identificationChapter: {
      title: 'Your identification information',
      hideFormTitle: true,
      pages: {
        identificationInformationPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
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
      hideFormTitle: true,
      pages: {
        mailingAddressPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
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
      hideFormTitle: true,
      pages: {
        phoneAndEmailPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
          path: 'phone-and-email',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailPage.uiSchema,
          schema: phoneAndEmailPage.schema,
          pageClass: 'phone-and-email',
        },
      },
    },
    statementChapter: {
      title: 'Your statement',
      hideFormTitle: true,
      pages: {
        statement: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NOT_LISTED,
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
