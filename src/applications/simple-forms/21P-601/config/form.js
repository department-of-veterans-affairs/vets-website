import footerContent from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { defaultItemPageScrollAndFocusTarget as scrollAndFocusTarget } from 'platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import {
  hasAlreadyFiled,
  hasUnpaidCreditors,
  eligibilitySummary,
  veteranFullName,
  veteranIdentifiers,
  beneficiaryIsVeteran,
  beneficiaryFullName,
  beneficiaryDateOfDeath,
  claimantNameAndDob,
  claimantSSN,
  claimantMailingAddress,
  claimantPhoneAndEmail,
  claimantRelationshipToDeceased,
  waiverOfSubstitution,
  relativesOverview,
  relativesPages,
  supportingDocuments,
  expensesClaim,
  expensesPages,
  otherDebts,
  otherDebtsPages,
  remarks,
} from '../pages';

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
    notFound: 'Please start over to apply for accrued benefits online.',
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
  title: 'Apply for accrued benefits online',
  subTitle:
    'For people other than the spouse, child or parent of deceased Veterans (VA Form 21P-601)',
  customText: {
    appType: 'form',
  },
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
          depends: formData => formData?.hasAlreadyFiled === false,
          uiSchema: hasUnpaidCreditors.uiSchema,
          schema: hasUnpaidCreditors.schema,
        },
        eligibilitySummary: {
          path: 'eligibility-summary',
          title: 'Eligibility results',
          depends: formData =>
            formData?.hasAlreadyFiled === true ||
            formData?.hasUnpaidCreditors === true,
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
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        veteranFullName: {
          path: 'veteran-name',
          title: "Veteran's name",
          uiSchema: veteranFullName.uiSchema,
          schema: veteranFullName.schema,
          scrollAndFocusTarget,
        },
        veteranIdentifiers: {
          path: 'veteran-identifiers',
          title: "Veteran's identification numbers",
          uiSchema: veteranIdentifiers.uiSchema,
          schema: veteranIdentifiers.schema,
          scrollAndFocusTarget,
        },
      },
    },
    deceasedBeneficiaryChapter: {
      title: 'Information about the deceased',
      depends: formData =>
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        beneficiaryIsVeteran: {
          path: 'beneficiary-is-veteran',
          title: 'Is the beneficiary the veteran?',
          uiSchema: beneficiaryIsVeteran.uiSchema,
          schema: beneficiaryIsVeteran.schema,
          scrollAndFocusTarget,
        },
        beneficiaryFullName: {
          path: 'beneficiary-name',
          title: "Deceased beneficiary's name",
          depends: formData => formData?.beneficiaryIsVeteran === false,
          uiSchema: beneficiaryFullName.uiSchema,
          schema: beneficiaryFullName.schema,
          scrollAndFocusTarget,
        },
        beneficiaryDateOfDeath: {
          path: 'beneficiary-date-of-death',
          title: 'Date of death',
          uiSchema: beneficiaryDateOfDeath.uiSchema,
          schema: beneficiaryDateOfDeath.schema,
          scrollAndFocusTarget,
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      depends: formData =>
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        claimantNameAndDob: {
          path: 'your-name-and-date-of-birth',
          title: 'Your name and date of birth',
          uiSchema: claimantNameAndDob.uiSchema,
          schema: claimantNameAndDob.schema,
          scrollAndFocusTarget,
        },
        claimantSSN: {
          path: 'your-ssn',
          title: 'Your identification information',
          uiSchema: claimantSSN.uiSchema,
          schema: claimantSSN.schema,
          scrollAndFocusTarget,
        },
        claimantMailingAddress: {
          path: 'your-mailing-address',
          title: 'Mailing address',
          uiSchema: claimantMailingAddress.uiSchema,
          schema: claimantMailingAddress.schema,
          scrollAndFocusTarget,
        },
        claimantPhoneAndEmail: {
          path: 'your-phone-and-email',
          title: 'Your phone and email address',
          uiSchema: claimantPhoneAndEmail.uiSchema,
          schema: claimantPhoneAndEmail.schema,
          scrollAndFocusTarget,
        },
        claimantRelationshipToDeceased: {
          path: 'your-relationship',
          title: 'Your relationship to the beneficiary',
          uiSchema: claimantRelationshipToDeceased.uiSchema,
          schema: claimantRelationshipToDeceased.schema,
          scrollAndFocusTarget,
        },
        waiverOfSubstitution: {
          path: 'waiver-of-substitution',
          title: 'Waiver of substitution',
          uiSchema: waiverOfSubstitution.uiSchema,
          schema: waiverOfSubstitution.schema,
          scrollAndFocusTarget,
        },
      },
    },
    survivingRelativesChapter: {
      title: 'Surviving relatives',
      depends: formData =>
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        relativesOverview: {
          path: 'surviving-relatives',
          title: 'Surviving relatives',
          uiSchema: relativesOverview.uiSchema,
          schema: relativesOverview.schema,
          scrollAndFocusTarget,
        },
        relativesSummary: {
          ...relativesPages.relativesSummary,
          depends: formData =>
            formData?.survivors?.hasNone !== true &&
            (!!formData?.survivors?.hasSpouse ||
              !!formData?.survivors?.hasChildren ||
              !!formData?.survivors?.hasParents),
        },
        relativeNamePage: {
          ...relativesPages.relativeNamePage,
          depends: formData =>
            formData?.survivors?.hasNone !== true &&
            (!!formData?.survivors?.hasSpouse ||
              !!formData?.survivors?.hasChildren ||
              !!formData?.survivors?.hasParents),
        },
        relativeAddressPage: {
          ...relativesPages.relativeAddressPage,
          depends: formData =>
            formData?.survivors?.hasNone !== true &&
            (!!formData?.survivors?.hasSpouse ||
              !!formData?.survivors?.hasChildren ||
              !!formData?.survivors?.hasParents),
        },
      },
    },
    expensesAndDebtsChapter: {
      title: 'Expenses and debts',
      depends: formData =>
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        expensesClaim: {
          path: 'reimbursement-claim',
          title: 'Reimbursement claim',
          uiSchema: expensesClaim.uiSchema,
          schema: expensesClaim.schema,
          scrollAndFocusTarget,
        },
        ...expensesPages,
        otherDebts: {
          path: 'other-debts',
          title: 'Other debts',
          depends: formData => formData?.claimingReimbursement === true,
          uiSchema: otherDebts.uiSchema,
          schema: otherDebts.schema,
          scrollAndFocusTarget,
        },
        ...otherDebtsPages,
      },
    },
    additionalInfoChapter: {
      title: 'Additional remarks',
      depends: formData =>
        formData?.hasAlreadyFiled === false &&
        formData?.hasUnpaidCreditors === false,
      pages: {
        supportingDocuments: {
          title: 'Supporting documents',
          path: 'supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        remarks: {
          path: 'additional-info/remarks',
          title: 'Additional remarks (optional)',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
          scrollAndFocusTarget,
        },
      },
    },
  },
};
export default formConfig;
