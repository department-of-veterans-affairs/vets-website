import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import PreSubmitSignature from '../components/PreSubmitSignature';
import * as pages from '../pages';
import { transform } from '../utils/transform';
import SubmissionError from '../components/SubmissionError';
import { WIZARD_STATUS } from '../wizard/constants';
import { prefillTransformer } from '../utils/prefillTransformer';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit: transform,
  submitUrl: `${environment.API_URL}/v0/financial_status_reports`,
  trackingPrefix: 'fsr-5655-',
  wizardStorageKey: WIZARD_STATUS,
  verifyRequiredPrefill: true,
  prefillTransformer,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitSignature,
  submissionError: SubmissionError,
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
  subTitle: 'Form 5655',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  customText: {
    finishAppLaterMessage: 'Finish this request later',
    reviewPageTitle: 'Review your request',
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
                first: 'Hector',
                last: 'Smith',
                middle: 'R',
              },
              dateOfBirth: '01/01/1970',
            },
            personalIdentification: {
              ssn: '1234',
              fileNumber: '5678',
            },
          },
        },
        availableDebts: {
          initialData: {
            selectedDebts: [],
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
                countryName: 'United States',
                addressLine1: '1234 W Nebraska St',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '33614',
              },
              telephoneNumber: '5551234567',
              primaryEmail: 'hector.smith@email.com',
              confirmationEmail: '',
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
          depends: formData => formData.questions.vetIsEmployed,
        },
        previousEmployment: {
          path: 'previous-employment',
          title: 'Previous employment',
          uiSchema: pages.previousEmployment.uiSchema,
          schema: pages.previousEmployment.schema,
        },
        previousEmploymentRecords: {
          path: 'previous-employment-records',
          title: 'Previous employment',
          uiSchema: pages.previousEmploymentRecords.uiSchema,
          schema: pages.previousEmploymentRecords.schema,
          depends: formData => formData.questions.vetPreviouslyEmployed,
        },
        benefits: {
          path: 'benefits',
          title: 'Benefits',
          uiSchema: pages.benefits.uiSchema,
          schema: pages.benefits.schema,
          initialData: {
            income: [
              {
                veteranOrSpouse: 'VETERAN',
                compensationAndPension: '75',
                education: '1400.40',
              },
              {
                veteranOrSpouse: 'SPOUSE',
                compensationAndPension: '0',
                education: '0',
              },
            ],
          },
        },
        socialSecurity: {
          path: 'social-security',
          title: 'Social security',
          uiSchema: pages.socialSecurity.uiSchema,
          schema: pages.socialSecurity.schema,
        },
        socialSecurityRecords: {
          path: 'social-security-records',
          title: 'Social security',
          uiSchema: pages.socialSecurityRecords.uiSchema,
          schema: pages.socialSecurityRecords.schema,
          depends: formData => formData.questions.hasSocialSecurity,
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
          depends: formData => formData.questions.hasAdditionalIncome,
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
          depends: formData => formData.questions.maritalStatus === 'Married',
        },
        spouseEmploymentRecords: {
          path: 'spouse-employment-records',
          title: 'Spouse employment',
          uiSchema: pages.spouseEmploymentRecords.uiSchema,
          schema: pages.spouseEmploymentRecords.schema,
          depends: formData => formData.questions.spouseIsEmployed,
        },
        spousePreviousEmployment: {
          path: 'spouse-previous-employment',
          title: 'Spouse previous employment',
          uiSchema: pages.spousePreviousEmployment.uiSchema,
          schema: pages.spousePreviousEmployment.schema,
          depends: formData => formData.questions.maritalStatus === 'Married',
        },
        spousePreviousEmploymentRecords: {
          path: 'spouse-previous-employment-records',
          title: 'Spouse employment',
          uiSchema: pages.spousePreviousEmploymentRecords.uiSchema,
          schema: pages.spousePreviousEmploymentRecords.schema,
          depends: formData =>
            formData.questions.maritalStatus === 'Married' &&
            formData.questions.spousePreviouslyEmployed,
        },
        spouseBenefits: {
          path: 'spouse-benefits',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefits.uiSchema,
          schema: pages.spouseBenefits.schema,
          depends: formData => formData.questions.maritalStatus === 'Married',
        },
        spouseBenefitRecords: {
          path: 'spouse-benefit-records',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefitRecords.uiSchema,
          schema: pages.spouseBenefitRecords.schema,
          depends: formData =>
            formData.questions.maritalStatus === 'Married' &&
            formData.questions.spouseHasBenefits,
        },
        spouseSocialSecurity: {
          path: 'spouse-social-security',
          title: 'Spouse social security',
          uiSchema: pages.spouseSocialSecurity.uiSchema,
          schema: pages.spouseSocialSecurity.schema,
          depends: formData => formData.questions.maritalStatus === 'Married',
        },
        spouseSocialSecurityRecords: {
          path: 'spouse-social-security-records',
          title: 'Spouse social security',
          uiSchema: pages.spouseSocialSecurityRecords.uiSchema,
          schema: pages.spouseSocialSecurityRecords.schema,
          depends: formData =>
            formData.questions.maritalStatus === 'Married' &&
            formData.questions.spouseHasSocialSecurity,
        },
        spouseAdditionalIncome: {
          path: 'spouse-additional-income',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncome.uiSchema,
          schema: pages.spouseAdditionalIncome.schema,
          depends: formData => formData.questions.maritalStatus === 'Married',
        },
        spouseAdditionalIncomeRecords: {
          path: 'spouse-additional-income-records',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncomeRecords.uiSchema,
          schema: pages.spouseAdditionalIncomeRecords.schema,
          depends: formData => formData.questions.spouseHasAdditionalIncome,
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
          depends: formData => formData.questions.hasDependents,
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
          depends: formData => formData.questions.hasRealEstate,
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
          depends: formData => formData.questions.hasVehicle,
        },
        recreationalVehicles: {
          path: 'recreational-vehicles',
          title: 'Recreational vehicles',
          uiSchema: pages.recreationalVehicles.uiSchema,
          schema: pages.recreationalVehicles.schema,
        },
        recreationalVehicleRecords: {
          path: 'recreational-vehicle-records',
          title: 'Recreational vehicles',
          uiSchema: pages.recreationalVehicleRecords.uiSchema,
          schema: pages.recreationalVehicleRecords.schema,
          depends: formData => formData.questions.hasRecreationalVehicle,
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
          depends: formData => formData.questions.hasOtherAssets,
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
          depends: formData => formData.questions.hasUtilities,
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
          depends: formData => formData.questions.hasRepayments,
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
          depends: formData => formData.questions.hasOtherExpenses,
        },
      },
    },
    resolutionOptionsChapter: {
      title: 'Repayment or relief options',
      pages: {
        resolutionOptions: {
          path: 'resolution-options/:index',
          title: 'Resolution options',
          showPagePerItem: true,
          arrayPath: 'selectedDebts',
          uiSchema: pages.resolutionOptions.uiSchema,
          schema: pages.resolutionOptions.schema,
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
          depends: formData => formData.questions.hasBeenAdjucatedBankrupt,
        },
      },
    },
  },
};

export default formConfig;
