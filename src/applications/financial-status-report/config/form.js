import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import {
  availableDebts,
  employmentHistory,
  additionalIncome,
  veteranInfo,
  spouseInformation,
  spouseAdditionalIncome,
  spouseEmployment,
  spouseSocialSecurity,
  spouseBenefits,
  spouseAdditionalEmployment,
  dependents,
  householdAssets,
  expenses,
  utilities,
  repayments,
  otherExpenses,
  resolutionOptions,
  resolutionComments,
} from '../pages';

const formChapterTitles = {
  veteranInformationTitle: 'Veteran information',
  householdIncomeTitle: 'Household income',
  householdAssets: 'Household Assets',
  householdExpenses: 'Household Expenses',
  resolutionOptions: 'Resolution Options',
};

const formPageTitles = {
  veteranInfo: 'Veteran information',
  availableDebts: 'Available Debts',
  employmentHistory: 'Your employment history',
  additionalIncome: 'Additional Income',
  spouseInformation: 'Spouse information',
  spouseEmployment: 'Spouse employment',
  spouseAdditionalEmployment: 'Spouse additonal employment',
  spouseSocialSecurity: 'Spouse social security',
  spouseBenefits: 'Spouse benefits',
  spouseAdditionalIncome: 'Spouse additional Income',
  dependents: 'Dependents',
  householdAssets: 'Household Assets',
  expenses: 'Household Expenses',
  utilities: 'Household Utilities',
  repayments: 'Household Repayments',
  otherExpenses: 'Other expenses',
  resolutionOptions: 'Resolution Options',
  resolutionComments: 'Resolution Comments',
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/api`,
  trackingPrefix: 'fsr-5655-',
  verifyRequiredPrefill: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
  title: 'Apply for financial hardship assistance',
  subTitle: 'Form 5655',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformationTitle,
      pages: {
        [formPageTitles.veteranInfo]: {
          path: 'veteran-information',
          title: formPageTitles.veteranInfo,
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        availableDebts: {
          initialData: { fsrDebts: [] },
          path: 'available-debts',
          title: formPageTitles.availableDebts,
          uiSchema: availableDebts.uiSchema,
          schema: availableDebts.schema,
        },
      },
    },
    householdIncomeChapter: {
      title: formChapterTitles.householdIncomeTitle,
      pages: {
        [formPageTitles.employmentHistory]: {
          path: 'employment-history',
          title: formPageTitles.employmentHistory,
          uiSchema: employmentHistory.uiSchema,
          schema: employmentHistory.schema,
        },
        [formPageTitles.additionalIncome]: {
          path: 'additional-income',
          title: formPageTitles.additionalIncome,
          uiSchema: additionalIncome.uiSchema,
          schema: additionalIncome.schema,
        },
        [formPageTitles.spouseInformation]: {
          path: 'spouse-information',
          title: formPageTitles.spouseInformation,
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        [formPageTitles.spouseEmployment]: {
          path: 'spouse-employment',
          title: formPageTitles.spouseEmployment,
          uiSchema: spouseEmployment.uiSchema,
          schema: spouseEmployment.schema,
        },
        [formPageTitles.spouseAdditionalEmployment]: {
          path: 'spouse-additional-employment',
          title: formPageTitles.spouseAdditionalEmployment,
          uiSchema: spouseAdditionalEmployment.uiSchema,
          schema: spouseAdditionalEmployment.schema,
        },
        [formPageTitles.spouseBenefits]: {
          path: 'spouse-benefits',
          title: formPageTitles.spouseBenefits,
          uiSchema: spouseBenefits.uiSchema,
          schema: spouseBenefits.schema,
        },
        [formPageTitles.spouseSocialSecurity]: {
          path: 'spouse-social-security',
          title: formPageTitles.spouseSocialSecurity,
          uiSchema: spouseSocialSecurity.uiSchema,
          schema: spouseSocialSecurity.schema,
        },
        [formPageTitles.spouseAdditionalIncome]: {
          path: 'spouse-additional-income',
          title: formPageTitles.spouseAdditionalIncome,
          uiSchema: spouseAdditionalIncome.uiSchema,
          schema: spouseAdditionalIncome.schema,
        },
        [formPageTitles.dependents]: {
          path: 'dependents',
          title: formPageTitles.dependents,
          uiSchema: dependents.uiSchema,
          schema: dependents.schema,
        },
      },
    },
    assetsInformationChapter: {
      title: formChapterTitles.householdAssets,
      pages: {
        [formPageTitles.householdAssets]: {
          path: 'household-assets',
          title: formPageTitles.householdAssets,
          uiSchema: householdAssets.uiSchema,
          schema: householdAssets.schema,
        },
      },
    },
    householdExpensesChapter: {
      title: formChapterTitles.householdExpenses,
      pages: {
        [formPageTitles.expenses]: {
          path: 'expenses',
          title: formPageTitles.expenses,
          uiSchema: expenses.uiSchema,
          schema: expenses.schema,
        },
        [formPageTitles.utilities]: {
          path: 'utilities',
          title: formPageTitles.utilities,
          uiSchema: utilities.uiSchema,
          schema: utilities.schema,
        },
        [formPageTitles.repayments]: {
          path: 'repayments',
          title: formPageTitles.repayments,
          uiSchema: repayments.uiSchema,
          schema: repayments.schema,
        },
        [formPageTitles.otherExpenses]: {
          path: 'other-expenses',
          title: formPageTitles.otherExpenses,
          uiSchema: otherExpenses.uiSchema,
          schema: otherExpenses.schema,
        },
      },
    },
    resolutionOptionsChapter: {
      title: formChapterTitles.resolutionOptions,
      pages: {
        [formPageTitles.resolutionOptions]: {
          path: 'resolution-options',
          title: formPageTitles.resolutionOptions,
          uiSchema: resolutionOptions.uiSchema,
          schema: resolutionOptions.schema,
        },
        [formPageTitles.resolutionComments]: {
          path: 'resolution-comments',
          title: formPageTitles.resolutionComments,
          uiSchema: resolutionComments.uiSchema,
          schema: resolutionComments.schema,
        },
      },
    },
  },
};

export default formConfig;
