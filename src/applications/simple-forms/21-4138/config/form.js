import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { profilePersonalInfoPage } from 'platform/forms-system/src/js/patterns/prefill/PersonalInformation';
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
import { decisionReviewPage } from '../pages/decisionReview';
import {
  newSupplementalClaimPage,
  supplementalClaimPage,
  higherLevelReviewPage,
  boardAppealPage,
} from '../pages/noticeOfDisagreement';
import { priorityProcessingPage } from '../pages/priorityProcessing';
import { personalRecordsRequestPage } from '../pages/recordsRequest';
import { claimStatusToolPage } from '../pages/newEvidence';
import { personalInformationPage } from '../pages/personalInformation';
import { identificationInformationPage } from '../pages/identificationInfo';
import { relationshipToVeteranPage } from '../pages/relationshipToVeteran';
import { claimantNamePage } from '../pages/claimantName';
import { veteranNameDobPage } from '../pages/veteranNameDob';
import { veteranIdentificationInformationPage } from '../pages/veteranIdentificationInfo';
import { veteranMailingAddressPage } from '../pages/veteranMailingAddress';
import { veteranContactInformationPage } from '../pages/veteranPhoneAndEmail';
import { mailingAddressPage } from '../pages/mailingAddress';
import { contactInformationPage } from '../pages/phoneAndEmail';
import { statementPage } from '../pages/statement';
import { statementVeteranPage } from '../pages/statementVeteran';
import { statementNonVeteranPage } from '../pages/statementNonVeteran';
import { claimantIdentityPage } from '../pages/claimantIdentity';
import {
  getMockData,
  isEligibleForDecisionReview,
  isEligibleToSubmitStatement,
  isUserVeteran,
  isClaimantVeteran,
  isNonVeteranClaimant,
} from '../helpers';
import prefillTransformer from './prefill-transformer';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/user.json';

const mockData = testData.data;

const confirmPersonalInformationCardHeader = React.createElement(
  'h4',
  { className: 'vads-u-font-size--h3 vads-u-margin-top--0' },
  'Personal information',
);

const confirmPersonalInformationNoteText =
  " To protect your personal information, we don't allow online changes to your name, date of birth, or Social Security number. If you need to change this information, call us at ";

const confirmPersonalInformationNoteTail =
  " (TTY: 711). We're here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.";

const legalNameUrl =
  `${environment.BASE_URL}/resources/` +
  'how-to-change-your-legal-name-on-file-with-va/';

const confirmPersonalInformationNote = React.createElement(
  'p',
  { className: 'vads-u-margin-top--2' },
  React.createElement('strong', null, 'Note:'),
  confirmPersonalInformationNoteText,
  React.createElement('va-telephone', { contact: '8008271000' }),
  confirmPersonalInformationNoteTail,
);

const confirmPersonalInformationFooter = React.createElement(
  'p',
  { className: 'vads-u-margin-bottom--4' },
  React.createElement('va-link', {
    external: true,
    href: legalNameUrl,
    text: 'Find more detailed instructions for how to change your legal name',
  }),
);

const confirmPersonalInformationPages = profilePersonalInfoPage({
  key: 'confirmPersonalInformationPage',
  title: 'Confirm personal information',
  path: 'confirm-personal-information',
  personalInfoConfig: {
    name: { show: true },
    ssn: { show: true },
    dateOfBirth: { show: true },
  },
  dataAdapter: {
    ssnPath: 'idNumber.ssn',
  },
  cardHeader: confirmPersonalInformationCardHeader,
  note: confirmPersonalInformationNote,
  footer: confirmPersonalInformationFooter,
  hideOnReview: true,
  depends: formData =>
    isEligibleToSubmitStatement(formData) && isClaimantVeteran(formData),
});

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
  prefillTransformer,
  hideUnauthedStartLink: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for statement in support of a claim.',
    noAuth:
      'Please sign in again to continue your application for statement in support of a claim.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/supporting-forms-for-claims',
        label: 'Supporting forms for VA claims',
      },
      {
        href: '/supporting-forms-for-claims/submit-statement-form-21-4138',
        label: 'Submit a statement to support a claim',
      },
    ],
  }),
  chapters: {
    statementTypeChapter: {
      title: 'What would you like to do?',
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
          title: "There's a better way to submit your statement",
          uiSchema: layWitnessStatementPage.uiSchema,
          schema: layWitnessStatementPage.schema,
          pageClass: 'lay-witness-statement',
          hideNavButtons: true,
        },
        decisionReviewPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.DECISION_REVIEW,
          path: 'decision-review',
          title: 'There’s a better way to tell us you disagree with a decision',
          uiSchema: decisionReviewPage.uiSchema,
          schema: decisionReviewPage.schema,
          pageClass: 'decision-review',
          hideSaveLinkAndStatus: true,
          hideNavButtons: true,
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
        priorityProcessingPage: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING,
          path: 'priority-processing',
          title: 'There’s a better way to tell us you need priority processing',
          uiSchema: priorityProcessingPage.uiSchema,
          schema: priorityProcessingPage.schema,
          pageClass: 'priority-processing',
          hideSaveLinkAndStatus: true,
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
            formData.statementType === STATEMENT_TYPES.NEW_EVIDENCE &&
            isUserVeteran(formData),
          path: 'claim-status-tool',
          title: "There's a better way to submit new evidence",
          uiSchema: claimStatusToolPage.uiSchema,
          schema: claimStatusToolPage.schema,
          pageClass: 'claim-status-tool',
          hideNavButtons: true,
        },
        claimStatusToolPageNonVeteran: {
          depends: formData =>
            formData.statementType === STATEMENT_TYPES.NEW_EVIDENCE &&
            !isUserVeteran(formData),
          path: 'claim-status-tool-continue',
          title: "There's a better way to submit new evidence",
          uiSchema: claimStatusToolPage.uiSchema,
          schema: claimStatusToolPage.schema,
          pageClass: 'claim-status-tool',
        },
      },
    },
    identityChapter: {
      title: 'Your identity',
      pages: {
        claimantIdentityPage: {
          depends: formData => isEligibleToSubmitStatement(formData),
          path: 'your-identity',
          title: 'Your identity',
          uiSchema: claimantIdentityPage.uiSchema,
          schema: claimantIdentityPage.schema,
          pageClass: 'claimant-identity',
        },
        relationshipToVeteranPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'relationship-to-veteran',
          title: 'Relationship to the Veteran',
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
          pageClass: 'relationship-to-veteran',
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...confirmPersonalInformationPages,
        claimantNamePage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'your-name',
          title: 'Your name',
          uiSchema: claimantNamePage.uiSchema,
          schema: claimantNamePage.schema,
          pageClass: 'claimant-name',
        },
        personalInformationPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            !isClaimantVeteran(formData) &&
            !isNonVeteranClaimant(formData),
          path: 'personal-information',
          title: 'Name and date of birth',
          uiSchema: personalInformationPage.uiSchema,
          schema: personalInformationPage.schema,
          pageClass: 'personal-information',
        },
      },
    },
    veteranPersonalInformationChapter: {
      title: "Veteran's personal information",
      pages: {
        veteranNameDobPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'veteran-name-and-date-of-birth',
          title: "Veteran's name and date of birth",
          uiSchema: veteranNameDobPage.uiSchema,
          schema: veteranNameDobPage.schema,
          pageClass: 'veteran-name-and-date-of-birth',
        },
        veteranIdentificationInformationPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'veteran-identification-information',
          title: "Veteran's identification information",
          uiSchema: veteranIdentificationInformationPage.uiSchema,
          schema: veteranIdentificationInformationPage.schema,
          pageClass: 'veteran-identification-information',
        },
      },
    },
    veteranContactInformationChapter: {
      title: "Veteran's contact information",
      pages: {
        veteranMailingAddressPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'veteran-mailing-address',
          title: "Veteran's mailing address",
          uiSchema: veteranMailingAddressPage.uiSchema,
          schema: veteranMailingAddressPage.schema,
          pageClass: 'veteran-mailing-address',
        },
        veteranContactInformationPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'veteran-phone-and-email',
          title: "Veteran's phone number and email address",
          uiSchema: veteranContactInformationPage.uiSchema,
          schema: veteranContactInformationPage.schema,
          pageClass: 'veteran-phone-and-email',
        },
      },
    },
    identificationChapter: {
      title: 'Your identification information',
      pages: {
        identificationInformationPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            !isNonVeteranClaimant(formData),
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
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            !isClaimantVeteran(formData) &&
            !isNonVeteranClaimant(formData),
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
        ...profileContactInfoPages({
          contactInfoPageKey: 'confirmContactInfo',
          contactPath: 'confirm-contact-information',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'mobilePhone'],
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isClaimantVeteran(formData),
        }),
        contactInformationPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            !isClaimantVeteran(formData) &&
            !isNonVeteranClaimant(formData),
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
        statementVeteranPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isClaimantVeteran(formData),
          path: 'statement-veteran',
          title: 'Your statement',
          uiSchema: statementVeteranPage.uiSchema,
          schema: statementVeteranPage.schema,
          pageClass: 'statement',
        },
        statementNonVeteranPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            isNonVeteranClaimant(formData),
          path: 'statement-non-veteran',
          title: 'Your statement',
          uiSchema: statementNonVeteranPage.uiSchema,
          schema: statementNonVeteranPage.schema,
          pageClass: 'statement',
        },
        statementPage: {
          depends: formData =>
            isEligibleToSubmitStatement(formData) &&
            !isClaimantVeteran(formData) &&
            !isNonVeteranClaimant(formData),
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
      fullNamePath: formData =>
        formData?.claimantType === 'self' ||
        formData?.claimantType === 'veteranSelf'
          ? 'view:profileFullName'
          : 'fullName',
      checkboxLabel:
        'I confirm that the information above is correct and true to the best of my knowledge and belief.',
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
