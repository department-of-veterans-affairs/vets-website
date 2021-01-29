import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import PreSubmitSignature from '../components/PreSubmitSignature';
import { prefillTransformer } from '../utils/prefillTransformer';
import {
  availableDebts,
  employment,
  previousEmployment,
  benefits,
  socialSecurity,
  additionalIncome,
  veteranInfo,
  spouseInformation,
  spouseAdditionalIncome,
  spouseEmployment,
  spouseSocialSecurity,
  spouseBenefits,
  spousePreviousEmployment,
  dependents,
  monetary,
  realEstate,
  recreationalVehicles,
  vehicles,
  otherAssets,
  expenses,
  utilities,
  repayments,
  otherExpenses,
  resolutionOptions,
  resolutionComments,
  bankruptcyHistory,
  contactInfo,
} from '../pages';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/api`,
  trackingPrefix: 'fsr-5655-',
  verifyRequiredPrefill: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitSignature,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
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
  title: 'Request help for VA debt',
  subTitle: 'Form 5655',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran information',
      pages: {
        veteranInfo: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        availableDebts: {
          initialData: { fsrDebts: [] },
          path: 'available-debts',
          title: 'Available Debts',
          uiSchema: availableDebts.uiSchema,
          schema: availableDebts.schema,
        },
        contactInfo: {
          initialData: {
            contactInfo: {
              primaryEmail: 'hector.smith@email.com',
              phoneNumber: '555-123-4567',
            },
          },
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
        },
      },
    },
    householdIncomeChapter: {
      title: 'Household income',
      pages: {
        employment: {
          path: 'employment',
          title: 'Employment',
          uiSchema: employment.uiSchema,
          schema: employment.schema,
        },
        previousEmployment: {
          path: 'previous-employment',
          title: 'Previous employment',
          uiSchema: previousEmployment.uiSchema,
          schema: previousEmployment.schema,
        },
        benefits: {
          path: 'benefits',
          title: 'Benefits',
          uiSchema: benefits.uiSchema,
          schema: benefits.schema,
        },
        socialSecurity: {
          path: 'social-security',
          title: 'Social security',
          uiSchema: socialSecurity.uiSchema,
          schema: socialSecurity.schema,
        },
        additionalIncome: {
          path: 'additional-income',
          title: 'Additional income',
          uiSchema: additionalIncome.uiSchema,
          schema: additionalIncome.schema,
        },
        spouseInformation: {
          path: 'spouse-information',
          title: 'Spouse information',
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        spouseEmployment: {
          path: 'spouse-employment',
          title: 'Spouse employment',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: spouseEmployment.uiSchema,
          schema: spouseEmployment.schema,
        },
        spousePreviousEmployment: {
          path: 'spouse-previous-employment',
          title: 'Spouse previous employment',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: spousePreviousEmployment.uiSchema,
          schema: spousePreviousEmployment.schema,
        },
        spouseBenefits: {
          path: 'spouse-benefits',
          title: 'Spouse benefits',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: spouseBenefits.uiSchema,
          schema: spouseBenefits.schema,
        },
        spouseSocialSecurity: {
          path: 'spouse-social-security',
          title: 'Spouse social security',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: spouseSocialSecurity.uiSchema,
          schema: spouseSocialSecurity.schema,
        },
        spouseAdditionalIncome: {
          path: 'spouse-additional-income',
          title: 'Spouse additional income',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: spouseAdditionalIncome.uiSchema,
          schema: spouseAdditionalIncome.schema,
        },
        dependents: {
          path: 'dependents',
          title: 'Dependents',
          uiSchema: dependents.uiSchema,
          schema: dependents.schema,
        },
      },
    },
    householdAssetsChapter: {
      title: 'Household assets',
      pages: {
        monetary: {
          path: 'monetary-assets',
          title: 'Monetary assets',
          uiSchema: monetary.uiSchema,
          schema: monetary.schema,
        },
        realEstate: {
          path: 'real-estate-assets',
          title: 'Real estate',
          uiSchema: realEstate.uiSchema,
          schema: realEstate.schema,
        },
        recreationalVehicles: {
          path: 'recreational-vehicles',
          title: 'Recreational vehicles',
          uiSchema: recreationalVehicles.uiSchema,
          schema: recreationalVehicles.schema,
        },
        vehicles: {
          path: 'vehicles',
          title: 'Vehicles',
          uiSchema: vehicles.uiSchema,
          schema: vehicles.schema,
        },
        otherAssets: {
          path: 'other-assets',
          title: 'Other assets',
          uiSchema: otherAssets.uiSchema,
          schema: otherAssets.schema,
        },
      },
    },
    householdExpensesChapter: {
      title: 'Household expenses',
      pages: {
        expenses: {
          path: 'expenses',
          title: 'Expenses',
          uiSchema: expenses.uiSchema,
          schema: expenses.schema,
        },
        utilities: {
          path: 'utilities',
          title: 'Utilities',
          uiSchema: utilities.uiSchema,
          schema: utilities.schema,
        },
        repayments: {
          path: 'repayments',
          title: 'Repayments',
          uiSchema: repayments.uiSchema,
          schema: repayments.schema,
        },
        otherExpenses: {
          path: 'other-expenses',
          title: 'Other expenses',
          uiSchema: otherExpenses.uiSchema,
          schema: otherExpenses.schema,
        },
      },
    },
    resolutionOptionsChapter: {
      title: 'Resolution options',
      pages: {
        resolutionOptions: {
          path: 'resolution-options/:index',
          title: 'Resolution options',
          showPagePerItem: true,
          arrayPath: 'fsrDebts',
          uiSchema: resolutionOptions.uiSchema,
          schema: resolutionOptions.schema,
        },
        resolutionComments: {
          path: 'resolution-comments',
          title: 'Resolution comments',
          uiSchema: resolutionComments.uiSchema,
          schema: resolutionComments.schema,
        },
      },
    },
    bankruptcyAttestationChapter: {
      title: 'Bankruptcy history',
      pages: {
        bankruptcyHistory: {
          path: 'bankruptcy-history',
          title: 'Bankruptcy history',
          uiSchema: bankruptcyHistory.uiSchema,
          schema: bankruptcyHistory.schema,
        },
      },
    },
  },
};

export default formConfig;
