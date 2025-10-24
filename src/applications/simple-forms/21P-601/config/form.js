import footerContent from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import { pageFocusScroll } from '../helpers';
import {
  hasAlreadyFiled,
  hasUnpaidCreditors,
  eligibilitySummary,
  veteranFullName,
  veteranIdentifiers,
  beneficiaryIsVeteran,
  beneficiaryFullName,
  beneficiaryDateOfDeath,
  claimantIdentification,
  claimantContact,
  claimantRelationship,
  relativesOverview,
  relativesPages,
  expensesClaim,
  expensesPages,
  otherDebts,
  otherDebtsPages,
  remarks,
} from '../pages';

//
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  transformForSubmit,
  trackingPrefix: '21p-601-accrued-benefits-',
  useCustomScrollAndFocus: true,
  v3SegmentedProgressBar: true,
  hideUnauthedStartLink: true,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-601',
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Application for Accrued Amounts Due a Deceased Beneficiary.',
    noAuth: 'Please sign in again to continue your application.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I certify that the statements on this form are true and correct to the best of my knowledge and belief.',
      messageAriaDescribedby:
        'I certify that the statements on this form are true and correct to the best of my knowledge and belief.',
      fullNamePath: 'claimantFullName',
    },
  },
  title: 'Application for Accrued Amounts Due a Deceased Beneficiary',
  defaultDefinitions: {},
  footerContent,
  chapters: {
    eligibilityChapter: {
      title: 'Check your eligibility',
      pages: {
        hasAlreadyFiled: {
          path: 'already-filed',
          title: 'Previous applications',
          uiSchema: hasAlreadyFiled.uiSchema,
          schema: hasAlreadyFiled.schema,
        },
        hasUnpaidCreditors: {
          path: 'unpaid-creditors',
          title: 'Creditor information',
          depends: formData => formData.hasAlreadyFiled === false,
          uiSchema: hasUnpaidCreditors.uiSchema,
          schema: hasUnpaidCreditors.schema,
        },
        eligibilitySummary: {
          path: 'eligibility-summary',
          title: 'Eligibility results',
          depends: formData =>
            formData.hasAlreadyFiled === true ||
            formData.hasUnpaidCreditors === true,
          uiSchema: eligibilitySummary.uiSchema,
          schema: eligibilitySummary.schema,
          // This page should be the end - no continue button
          hideNavButtons: true,
          customNavButtons: () => null,
        },
      },
    },
    veteranInformationChapter: {
      title: 'Veteran information',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        veteranFullName: {
          path: 'veteran-name',
          title: "Veteran's name",
          uiSchema: veteranFullName.uiSchema,
          schema: veteranFullName.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        veteranIdentifiers: {
          path: 'veteran-identifiers',
          title: "Veteran's identification numbers",
          uiSchema: veteranIdentifiers.uiSchema,
          schema: veteranIdentifiers.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    deceasedBeneficiaryChapter: {
      title: 'Information about the deceased',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        beneficiaryIsVeteran: {
          path: 'beneficiary-is-veteran',
          title: 'Is the beneficiary the veteran?',
          uiSchema: beneficiaryIsVeteran.uiSchema,
          schema: beneficiaryIsVeteran.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        beneficiaryFullName: {
          path: 'beneficiary-name',
          title: "Deceased beneficiary's name",
          depends: formData => formData.beneficiaryIsVeteran === false,
          uiSchema: beneficiaryFullName.uiSchema,
          schema: beneficiaryFullName.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        beneficiaryDateOfDeath: {
          path: 'beneficiary-date-of-death',
          title: 'Date of death',
          uiSchema: beneficiaryDateOfDeath.uiSchema,
          schema: beneficiaryDateOfDeath.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        claimantIdentification: {
          path: 'your-personal-information',
          title: 'Your personal information',
          uiSchema: claimantIdentification.uiSchema,
          schema: claimantIdentification.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        claimantContact: {
          path: 'your-contact-information',
          title: 'Your contact information',
          uiSchema: claimantContact.uiSchema,
          schema: claimantContact.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        claimantRelationship: {
          path: 'your-relationship',
          title: 'Your relationship to the deceased',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    survivingRelativesChapter: {
      title: 'Surviving relatives',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        relativesOverview: {
          path: 'surviving-relatives',
          title: 'Surviving relatives',
          uiSchema: relativesOverview.uiSchema,
          schema: relativesOverview.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        ...relativesPages,
      },
    },
    expensesAndDebtsChapter: {
      title: 'Expenses and debts',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        expensesClaim: {
          path: 'reimbursement-claim',
          title: 'Reimbursement claim',
          uiSchema: expensesClaim.uiSchema,
          schema: expensesClaim.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        ...expensesPages,
        otherDebts: {
          path: 'other-debts',
          title: 'Other debts',
          depends: formData => formData.claimingReimbursement === true,
          uiSchema: otherDebts.uiSchema,
          schema: otherDebts.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        ...otherDebtsPages,
      },
    },
    additionalInfoChapter: {
      title: 'Additional remarks',
      depends: formData =>
        formData.hasAlreadyFiled === false &&
        formData.hasUnpaidCreditors === false,
      pages: {
        remarks: {
          path: 'additional-info/remarks',
          title: 'Additional remarks (optional)',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
  },
};
export default formConfig;
