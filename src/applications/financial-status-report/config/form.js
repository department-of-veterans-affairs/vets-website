import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import PreSubmitSignature from '../components/PreSubmitSignature';
import { prefillTransformer } from '../utils/prefillTransformer';
import * as pages from '../pages';

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
  title: 'Request help with VA debt with VA Form 5655',
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
          uiSchema: pages.veteranInfo.uiSchema,
          schema: pages.veteranInfo.schema,
          initialData: {
            personalData: {
              fullName: {
                first: 'Hector',
                last: 'Smith',
                middle: 'R',
              },
              dateOfBirth: '01/01/1970',
            },
            personalIdentification: {
              sSn: '1234',
              vaFileNumber: '5678',
            },
          },
        },
        availableDebts: {
          initialData: {
            fsrDebts: [],
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
            contactInfo: {
              primaryEmail: 'hector.smith@email.com',
              confirmationEmail: 'hector.smith@email.com',
              phoneNumber: '5551234567',
            },
            mailingAddress: {
              country: 'United States',
              city: 'Tampa',
              state: 'FL',
              zipCode: '33614',
              addressLine1: '1234 W Nebraska St',
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
          depends: formData => formData.employment.isEmployed === true,
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
          depends: formData => formData.employment.previouslyEmployed === true,
        },
        benefits: {
          path: 'benefits',
          title: 'Benefits',
          uiSchema: pages.benefits.uiSchema,
          schema: pages.benefits.schema,
          initialData: {
            benefits: {},
          },
        },
        socialSecurity: {
          path: 'social-security',
          title: 'Social security',
          uiSchema: pages.socialSecurity.uiSchema,
          schema: pages.socialSecurity.schema,
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
            formData.additionalIncome.hasAdditionalIncome === true,
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
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: pages.spouseEmployment.uiSchema,
          schema: pages.spouseEmployment.schema,
        },
        spousePreviousEmployment: {
          path: 'spouse-previous-employment',
          title: 'Spouse previous employment',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married' &&
            formData.employment.spouseHasBeenEmployed,
          uiSchema: pages.spousePreviousEmployment.uiSchema,
          schema: pages.spousePreviousEmployment.schema,
        },
        spouseBenefits: {
          path: 'spouse-benefits',
          title: 'Spouse benefits',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: pages.spouseBenefits.uiSchema,
          schema: pages.spouseBenefits.schema,
        },
        spouseSocialSecurity: {
          path: 'spouse-social-security',
          title: 'Spouse social security',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: pages.spouseSocialSecurity.uiSchema,
          schema: pages.spouseSocialSecurity.schema,
        },
        spouseAdditionalIncome: {
          path: 'spouse-additional-income',
          title: 'Spouse additional income',
          depends: formData =>
            formData.spouseInformation.maritalStatus === 'Married',
          uiSchema: pages.spouseAdditionalIncome.uiSchema,
          schema: pages.spouseAdditionalIncome.schema,
        },
        dependents: {
          path: 'dependents',
          title: 'Dependents',
          uiSchema: pages.dependents.uiSchema,
          schema: pages.dependents.schema,
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
        recreationalVehicles: {
          path: 'recreational-vehicles',
          title: 'Recreational vehicles',
          uiSchema: pages.recreationalVehicles.uiSchema,
          schema: pages.recreationalVehicles.schema,
        },
        vehicles: {
          path: 'vehicles',
          title: 'Vehicles',
          uiSchema: pages.vehicles.uiSchema,
          schema: pages.vehicles.schema,
        },
        otherAssets: {
          path: 'other-assets',
          title: 'Other assets',
          uiSchema: pages.otherAssets.uiSchema,
          schema: pages.otherAssets.schema,
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
        repayments: {
          path: 'repayments',
          title: 'Repayments',
          uiSchema: pages.repayments.uiSchema,
          schema: pages.repayments.schema,
        },
        otherExpenses: {
          path: 'other-expenses',
          title: 'Other expenses',
          uiSchema: pages.otherExpenses.uiSchema,
          schema: pages.otherExpenses.schema,
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
      },
    },
  },
};

export default formConfig;
