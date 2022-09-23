import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';
import GetFormHelp from '../components/GetFormHelp';
import PreSubmitSignature from '../components/PreSubmitSignature';
import * as pages from '../pages';
import { transform } from '../utils/transform';
import { SubmissionAlert } from '../components/Alerts';
import { WIZARD_STATUS } from '../wizard/constants';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit: transform,
  submitUrl: `${environment.API_URL}/v0/financial_status_reports`,
  submissionError: SubmissionAlert,
  trackingPrefix: 'fsr-5655-',
  wizardStorageKey: WIZARD_STATUS,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitSignature,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  defaultDefinitions: {},
  savedFormMessages: {
    notFound:
      'Please start over to submit an application for financial hardship assistance.',
    noAuth:
      'Please sign in again to continue your application for financial hardship assistance.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your application for financial hardship assistance is in progress.',
      expired:
        'Your saved application for financial hardship assistance has expired. If you want to submit a application for financial hardship assistance, please start a new application for financial hardship assistance.',
      saved:
        'Your application for financial hardship assistance has been saved.',
    },
  },
  title: 'Request help with VA debt (VA Form 5655)',
  subTitle: 'Financial Status Report',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  customText: {
    finishAppLaterMessage: 'Finish this request later',
    reviewPageTitle: 'Review your request',
    submitButtonText: 'Submit your request',
  },
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran information',
      pages: {
        veteranInfo: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: pages.veteranInfo.uiSchema,
          schema: pages.veteranInfo.schema,
          editModeOnReviewPage: true,
          initialData: {
            personalData: {
              veteranFullName: {
                first: '',
                last: '',
                middle: '',
              },
              dateOfBirth: '',
            },
            personalIdentification: {
              ssn: '',
              fileNumber: '',
            },
          },
        },
        availableDebts: {
          initialData: {
            selectedDebts: [],
            selectedDebtsAndCopays: [],
            debt: {
              currentAr: 0,
              debtHistory: [{ date: '' }],
              deductionCode: '',
              originalAr: 0,
            },
          },
          path: 'available-debts',
          title: 'Available Debts',
          uiSchema: pages.availableDebts.uiSchema,
          schema: pages.availableDebts.schema,
        },
        contactInfo: {
          initialData: {
            personalData: {
              address: {
                street: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
              },
              telephoneNumber: '',
              emailAddress: '',
            },
          },
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: pages.contactInfo.uiSchema,
          schema: pages.contactInfo.schema,
        },
      },
    },
    householdIncomeChapter: {
      title: 'Household income',
      pages: {
        employment: {
          path: 'employment',
          title: 'Employment',
          uiSchema: pages.employment.uiSchema,
          schema: pages.employment.schema,
        },
        employmentRecords: {
          path: 'employment-records',
          title: 'Employment',
          uiSchema: pages.employmentRecords.uiSchema,
          schema: pages.employmentRecords.schema,
          depends: ({ questions }) => questions.vetIsEmployed,
          editModeOnReviewPage: true,
        },
        income: {
          title: 'Income',
          path: 'income/:index',
          arrayPath: 'currEmployment',
          showPagePerItem: true,
          uiSchema: pages.income.uiSchema,
          schema: pages.income.schema,
          editModeOnReviewPage: true,
          depends: ({ questions }) => questions.vetIsEmployed,
        },
        benefits: {
          path: 'benefits',
          title: 'Benefits',
          uiSchema: pages.benefits.uiSchema,
          schema: pages.benefits.schema,
        },
        socialSecurity: {
          path: 'social-security',
          title: 'Social Security',
          uiSchema: pages.socialSecurity.uiSchema,
          schema: pages.socialSecurity.schema,
        },
        socialSecurityRecords: {
          path: 'social-security-records',
          title: 'Social Security',
          uiSchema: pages.socialSecurityRecords.uiSchema,
          schema: pages.socialSecurityRecords.schema,
          depends: ({ questions }) => questions.hasSocialSecurity,
        },
        additionalIncome: {
          path: 'additional-income',
          title: 'Additional income',
          uiSchema: pages.additionalIncome.uiSchema,
          schema: pages.additionalIncome.schema,
        },
        additionalIncomeRecords: {
          path: 'additional-income-records',
          title: 'Additional income',
          uiSchema: pages.additionalIncomeRecords.uiSchema,
          schema: pages.additionalIncomeRecords.schema,
          depends: formData =>
            formData.questions.hasAdditionalIncome &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        additionalIncomeChecklist: {
          path: 'additional-income-checklist',
          title: 'Additional income options',
          uiSchema: pages.additionalIncomeChecklist.uiSchema,
          schema: pages.additionalIncomeChecklist.schema,
          depends: formData =>
            formData.questions.hasAdditionalIncome &&
            formData['view:enhancedFinancialStatusReport'],
        },
        spouseInformation: {
          path: 'spouse-information',
          title: 'Spouse information',
          uiSchema: pages.spouseInformation.uiSchema,
          schema: pages.spouseInformation.schema,
        },
        spouseEmployment: {
          path: 'spouse-employment',
          title: 'Spouse employment',
          uiSchema: pages.spouseEmployment.uiSchema,
          schema: pages.spouseEmployment.schema,
          depends: ({ questions }) => questions.isMarried,
        },
        spouseEmploymentRecords: {
          path: 'spouse-employment-records',
          title: 'Spouse employment',
          uiSchema: pages.spouseEmploymentRecords.uiSchema,
          schema: pages.spouseEmploymentRecords.schema,
          depends: ({ questions }) =>
            questions.isMarried && questions.spouseIsEmployed,
          editModeOnReviewPage: true,
        },
        spouseIncome: {
          title: 'Income',
          path: 'spouse/income/:index',
          arrayPath: 'spCurrEmployment',
          showPagePerItem: true,
          uiSchema: pages.spouseIncome.uiSchema,
          schema: pages.spouseIncome.schema,
          depends: ({ questions }) =>
            questions.isMarried && questions.spouseIsEmployed,
          editModeOnReviewPage: true,
        },
        spouseBenefits: {
          path: 'spouse-benefits',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefits.uiSchema,
          schema: pages.spouseBenefits.schema,
          depends: ({ questions }) => questions.isMarried,
        },
        spouseBenefitRecords: {
          path: 'spouse-benefit-records',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefitRecords.uiSchema,
          schema: pages.spouseBenefitRecords.schema,
          depends: ({ questions }) =>
            questions.isMarried && questions.spouseHasBenefits,
        },
        spouseSocialSecurity: {
          path: 'spouse-social-security',
          title: 'Spouse Social Security',
          uiSchema: pages.spouseSocialSecurity.uiSchema,
          schema: pages.spouseSocialSecurity.schema,
          depends: ({ questions }) => questions.isMarried,
        },
        spouseSocialSecurityRecords: {
          path: 'spouse-social-security-records',
          title: 'Spouse Social Security',
          uiSchema: pages.spouseSocialSecurityRecords.uiSchema,
          schema: pages.spouseSocialSecurityRecords.schema,
          depends: ({ questions }) =>
            questions.isMarried && questions.spouseHasSocialSecurity,
        },
        spouseAdditionalIncome: {
          path: 'spouse-additional-income',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncome.uiSchema,
          schema: pages.spouseAdditionalIncome.schema,
          depends: ({ questions }) => questions.isMarried,
        },
        spouseAdditionalIncomeRecords: {
          path: 'spouse-additional-income-records',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncomeRecords.uiSchema,
          schema: pages.spouseAdditionalIncomeRecords.schema,
          depends: ({ questions }) =>
            questions.isMarried && questions.spouseHasAdditionalIncome,
          editModeOnReviewPage: true,
        },
        dependents: {
          path: 'dependents',
          title: 'Dependents',
          uiSchema: pages.dependents.uiSchema,
          schema: pages.dependents.schema,
        },
        dependentRecords: {
          path: 'dependent-records',
          title: 'Dependents',
          uiSchema: pages.dependentRecords.uiSchema,
          schema: pages.dependentRecords.schema,
          depends: ({ questions }) => questions.hasDependents,
          editModeOnReviewPage: true,
        },
      },
    },
    householdAssetsChapter: {
      title: 'Household assets',
      pages: {
        monetary: {
          path: 'monetary-assets',
          title: 'Monetary assets',
          uiSchema: pages.monetary.uiSchema,
          schema: pages.monetary.schema,
        },
        realEstate: {
          path: 'real-estate-assets',
          title: 'Real estate',
          uiSchema: pages.realEstate.uiSchema,
          schema: pages.realEstate.schema,
        },
        realEstateRecords: {
          path: 'real-estate-asset-records',
          title: 'Real estate',
          uiSchema: pages.realEstateRecords.uiSchema,
          schema: pages.realEstateRecords.schema,
          depends: ({ questions }) => questions.hasRealEstate,
          editModeOnReviewPage: true,
        },
        vehicles: {
          path: 'vehicles',
          title: 'Vehicles',
          uiSchema: pages.vehicles.uiSchema,
          schema: pages.vehicles.schema,
        },
        vehicleRecords: {
          path: 'vehicle-records',
          title: 'Vehicles',
          uiSchema: pages.vehicleRecords.uiSchema,
          schema: pages.vehicleRecords.schema,
          depends: ({ questions }) => questions.hasVehicle,
          editModeOnReviewPage: true,
        },
        recreationalVehicles: {
          path: 'recreational-vehicles',
          title: 'Recreational vehicles',
          uiSchema: pages.recreationalVehicles.uiSchema,
          schema: pages.recreationalVehicles.schema,
        },
        recreationalVehicleRecords: {
          path: 'cfsr-recreational-vehicle-records',
          title: 'Recreational vehicles',
          uiSchema:
            pages.recreationalVehicleRecords
              .combinedFSRRecreationalUIVehicleSchema,
          schema:
            pages.recreationalVehicleRecords
              .combinedFSRRecreationalVehicleSchema,
          depends: formData =>
            formData.questions.hasRecreationalVehicle &&
            formData['view:combinedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        recreationalVehicleRecordsListLoop: {
          path: 'recreational-vehicle-records',
          title: 'Recreational vehicles',
          uiSchema:
            pages.recreationalVehicleRecords.fSRRecreationalVehicleUISchema,
          schema: pages.recreationalVehicleRecords.fSRRecreationalVehicleSchema,
          depends: formData =>
            formData.questions.hasRecreationalVehicle &&
            !formData['view:combinedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        otherAssets: {
          path: 'other-assets',
          title: 'Other assets',
          uiSchema: pages.otherAssets.uiSchema,
          schema: pages.otherAssets.schema,
        },
        otherAssetRecords: {
          path: 'other-asset-records',
          title: 'Other assets',
          uiSchema: pages.otherAssetRecords.uiSchema,
          schema: pages.otherAssetRecords.schema,
          depends: ({ questions }) => questions.hasOtherAssets,
          editModeOnReviewPage: true,
        },
      },
    },
    householdExpensesChapter: {
      title: 'Household expenses',
      pages: {
        expenses: {
          path: 'expenses',
          title: 'Expenses',
          uiSchema: pages.expenses.uiSchema,
          schema: pages.expenses.schema,
        },
        utilities: {
          path: 'utilities',
          title: 'Utilities',
          uiSchema: pages.utilities.uiSchema,
          schema: pages.utilities.schema,
        },
        utilityRecords: {
          path: 'utility-records',
          title: 'Utilities',
          uiSchema: pages.utilityRecords.uiSchema,
          schema: pages.utilityRecords.schema,
          depends: ({ questions }) => questions.hasUtilities,
          editModeOnReviewPage: true,
        },
        repayments: {
          path: 'repayments',
          title: 'Repayments',
          uiSchema: pages.repayments.uiSchema,
          schema: pages.repayments.schema,
        },
        repaymentRecords: {
          path: 'repayment-records',
          title: 'Repayments',
          uiSchema: pages.repaymentRecords.uiSchema,
          schema: pages.repaymentRecords.schema,
          depends: ({ questions }) => questions.hasRepayments,
          editModeOnReviewPage: true,
        },
        otherExpenses: {
          path: 'other-expenses',
          title: 'Other expenses',
          uiSchema: pages.otherExpenses.uiSchema,
          schema: pages.otherExpenses.schema,
        },
        otherExpenseRecords: {
          path: 'other-expense-records',
          title: 'Other expenses',
          uiSchema: pages.otherExpenseRecords.uiSchema,
          schema: pages.otherExpenseRecords.schema,
          depends: ({ questions }) => questions.hasOtherExpenses,
          editModeOnReviewPage: true,
        },
      },
    },
    resolutionOptionsChapter: {
      title: 'Repayment or relief options',
      pages: {
        resolutionOptions: {
          path: 'resolution-options',
          title: 'Resolution options',
          depends: formData => !formData['view:combinedFinancialStatusReport'],
          uiSchema: pages.resolutionOptions.uiSchema,
          schema: pages.resolutionOptions.schema,
        },
        // New resolution radio options
        resolutionOption: {
          title: 'Resolution Option',
          depends: formData =>
            formData.selectedDebtsAndCopays?.length > 0 &&
            formData['view:combinedFinancialStatusReport'],
          path: 'resolution-option/:index',
          showPagePerItem: true,
          arrayPath: 'selectedDebtsAndCopays',
          uiSchema: pages.resolutionOption.uiSchema,
          schema: pages.resolutionOption.schema,
        },
        // New text field
        resolutionComment: {
          title: 'Resolution Amount',
          depends: (formData, index) => {
            return (
              formData.selectedDebtsAndCopays?.length > 0 &&
              formData['view:combinedFinancialStatusReport'] &&
              formData.selectedDebtsAndCopays[index]?.resolutionOption !==
                'waiver'
            );
          },
          path: 'resolution-comment/:index',
          showPagePerItem: true,
          arrayPath: 'selectedDebtsAndCopays',
          uiSchema: pages.resolutionComment.uiSchema,
          schema: pages.resolutionComment.schema,
        },
        resolutionComments: {
          path: 'resolution-comments',
          title: 'Resolution comments',
          uiSchema: pages.resolutionComments.uiSchema,
          schema: pages.resolutionComments.schema,
        },
      },
    },
    bankruptcyAttestationChapter: {
      title: 'Bankruptcy history',
      pages: {
        bankruptcyHistory: {
          path: 'bankruptcy-history',
          title: 'Bankruptcy history',
          uiSchema: pages.bankruptcyHistory.uiSchema,
          schema: pages.bankruptcyHistory.schema,
        },
        bankruptcyHistoryRecords: {
          path: 'bankruptcy-history-records',
          title: 'Bankruptcy history',
          uiSchema: pages.bankruptcyHistoryRecords.uiSchema,
          schema: pages.bankruptcyHistoryRecords.schema,
          depends: ({ questions }) => questions.hasBeenAdjudicatedBankrupt,
        },
      },
    },
  },
};

export default formConfig;
