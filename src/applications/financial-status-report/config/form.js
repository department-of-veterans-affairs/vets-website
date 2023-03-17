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
import EnhancedEmploymentRecord from '../components/EnhancedEmploymentRecord';
import EnhancedSpouseEmploymentRecord from '../components/EnhancedSpouseEmploymentRecord';
import EnhancedVehicleRecord from '../components/EnhancedVehicleRecord';
import GrossMonthlyIncomeInput from '../components/GrossMonthlyIncomeInput';
import SpouseGrossMonthlyIncomeInput from '../components/SpouseGrossMonthlyIncomeInput';
import SpousePayrollDeductionChecklist from '../components/SpousePayrollDeductionChecklist';
import SpousePayrollDeductionInputList from '../components/SpousePayrollDeductionInputList';
import PayrollDeductionChecklist from '../components/PayrollDeductionChecklist';
import PayrollDeductionInputList from '../components/PayrollDeductionInputList';
import EmploymentHistoryWidget from '../pages/income/employmentEnhanced/EmploymentHistoryWidget';
import VehicleSummaryWidget from '../pages/assets/vehicles/VehicleSummaryWidget';
import AddAsset from '../components/otherAssets/AddAsset';
import OtherAssetsSummary from '../components/otherAssets/OtherAssetsSummary';
import OtherAssetsSummaryReview from '../components/otherAssets/OtherAssetsSummaryReview';
import submitForm from './submitForm';
import SpouseEmploymentHistoryWidget from '../pages/income/employmentEnhanced/SpouseEmploymentHistoryWidget';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit: transform,
  submitUrl: `${environment.API_URL}/v0/financial_status_reports`,
  submit: submitForm,
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
  title: 'Request help with VA debt for overpayments and copay bills',
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
          depends: formData => !formData['view:combinedFinancialStatusReport'],
        },
        combinedAvailableDebts: {
          initialData: {
            selectedDebts: [],
            selectedDebtsAndCopays: [],
          },
          path: 'all-available-debts',
          title: 'Available Debts',
          uiSchema: pages.combinedDebts.uiSchema,
          schema: pages.combinedDebts.schema,
          depends: formData => formData['view:combinedFinancialStatusReport'],
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
        // loop begins
        employmentRecords: {
          path: 'employment-records',
          title: 'Employment',
          uiSchema: pages.employmentRecords.uiSchema,
          schema: pages.employmentRecords.schema,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        enhancedEmploymentRecords: {
          path: 'enhanced-employment-records',
          title: 'Employment',
          uiSchema: pages.enhancedEmploymentRecords.uiSchema,
          schema: pages.enhancedEmploymentRecords.schema,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedEmploymentRecord,
        },
        grossMonthlyIncome: {
          path: 'gross-monthly-income',
          title: 'Gross monthly income',
          uiSchema: pages.grossMonthlyIncome.uiSchema,
          schema: pages.grossMonthlyIncome.schema,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: GrossMonthlyIncomeInput,
        },
        payrollDeductionChecklist: {
          path: 'deduction-checklist',
          title: 'Payroll deductions',
          uiSchema: pages.payrollDeductionChecklist.uiSchema,
          schema: pages.payrollDeductionChecklist.schema,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: PayrollDeductionChecklist,
        },
        payrollDeductionInputList: {
          title: 'Deduction amounts',
          path: 'deduction-values',
          // listOfIssues defined in next section
          uiSchema: pages.payrollDeductionInputList.uiSchema,
          schema: pages.payrollDeductionInputList.schema,
          // needed to bypass bug on review & submit page
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          CustomPage: PayrollDeductionInputList,
        },
        // loop ends with option to re enter here
        employmentHistorySummary: {
          path: 'employment-history',
          title: 'Employment',
          uiSchema: pages.employmentHistory.uiSchema,
          schema: pages.employmentHistory.schema,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EmploymentHistoryWidget,
        },
        income: {
          title: 'Income',
          path: 'income/:index',
          arrayPath: 'currEmployment',
          showPagePerItem: true,
          uiSchema: pages.income.uiSchema,
          schema: pages.income.schema,
          editModeOnReviewPage: true,
          depends: formData =>
            formData.questions.vetIsEmployed &&
            !formData['view:enhancedFinancialStatusReport'],
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        socialSecurityRecords: {
          path: 'social-security-records',
          title: 'Social Security',
          uiSchema: pages.socialSecurityRecords.uiSchema,
          schema: pages.socialSecurityRecords.schema,
          depends: formData =>
            formData.questions.hasSocialSecurity &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        additionalIncome: {
          path: 'additional-income',
          title: 'Additional income',
          uiSchema: pages.additionalIncome.uiSchema,
          schema: pages.additionalIncome.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
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
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        additionalIncomeValues: {
          path: 'additional-income-values',
          title: 'Additional income values',
          uiSchema: pages.additionalIncomeValues.uiSchema,
          schema: pages.additionalIncomeValues.schema,
          depends: formData =>
            formData.additionalIncome?.addlIncRecords?.length &&
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
          depends: formData =>
            formData.questions.isMarried &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseEmploymentRecords: {
          path: 'spouse-employment-records',
          title: 'Spouse employment',
          uiSchema: pages.spouseEmploymentRecords.uiSchema,
          schema: pages.spouseEmploymentRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        spouseIncome: {
          title: 'Income',
          path: 'spouse/income/:index',
          arrayPath: 'spCurrEmployment',
          showPagePerItem: true,
          uiSchema: pages.spouseIncome.uiSchema,
          schema: pages.spouseIncome.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        spouseBenefits: {
          path: 'spouse-benefits',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefits.uiSchema,
          schema: pages.spouseBenefits.schema,
          depends: formData =>
            formData.questions.isMarried &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseBenefitRecords: {
          path: 'spouse-benefit-records',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefitRecords.uiSchema,
          schema: pages.spouseBenefitRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseHasBenefits &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseSocialSecurity: {
          path: 'spouse-social-security',
          title: 'Spouse Social Security',
          uiSchema: pages.spouseSocialSecurity.uiSchema,
          schema: pages.spouseSocialSecurity.schema,
          depends: formData =>
            formData.questions.isMarried &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseSocialSecurityRecords: {
          path: 'spouse-social-security-records',
          title: 'Spouse Social Security',
          uiSchema: pages.spouseSocialSecurityRecords.uiSchema,
          schema: pages.spouseSocialSecurityRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseHasSocialSecurity &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseAdditionalIncome: {
          path: 'spouse-additional-income',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncome.uiSchema,
          schema: pages.spouseAdditionalIncome.schema,
          depends: formData =>
            formData.questions.isMarried &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        spouseAdditionalIncomeRecords: {
          path: 'spouse-additional-income-records',
          title: 'Spouse additional income',
          uiSchema: pages.spouseAdditionalIncomeRecords.uiSchema,
          schema: pages.spouseAdditionalIncomeRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseHasAdditionalIncome &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        spouseEmploymentQuestion: {
          path: 'enhanced-spouse-employment-question',
          title: 'Employment',
          uiSchema: pages.spouseEmploymentQuestion.uiSchema,
          schema: pages.spouseEmploymentQuestion.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: false,
        },
        enhancedSpouseEmploymentRecords: {
          path: 'enhanced-spouse-employment-records',
          title: 'Employment',
          uiSchema: pages.enhancedEmploymentRecords.uiSchema,
          schema: pages.enhancedEmploymentRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedSpouseEmploymentRecord,
        },
        enhancedSpouseGrossMonthlyIncome: {
          path: 'spouse-gross-monthly-income',
          title: 'Gross monthly income',
          uiSchema: pages.spouseGrossMonthlyIncome.uiSchema,
          schema: pages.spouseGrossMonthlyIncome.schema,
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpouseGrossMonthlyIncomeInput,
        },
        spousePayrollDeductionChecklist: {
          path: 'spouse-deduction-checklist',
          title: 'Payroll deductions',
          uiSchema: pages.spousePayrollDeductionChecklist.uiSchema,
          schema: pages.spousePayrollDeductionChecklist.schema,
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpousePayrollDeductionChecklist,
        },
        spousePayrollDeductionInputList: {
          title: 'Spouse deduction amounts',
          path: 'spouse-deduction-values',
          // listOfIssues defined in next section
          uiSchema: pages.spousePayrollDeductionInputList.uiSchema,
          schema: pages.spousePayrollDeductionInputList.schema,
          // needed to bypass bug on review & submit page
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          CustomPage: SpousePayrollDeductionInputList,
        },
        spouseEmploymentHistory: {
          path: 'spouse-employment-history',
          title: 'Employment',
          uiSchema: pages.spouseEmploymentHistory.uiSchema,
          schema: pages.spouseEmploymentHistory.schema,
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpouseEmploymentHistoryWidget,
        },
        spouseAdditionalIncomeCheckList: {
          path: 'spouse-additional-income-checklist',
          title: 'Additional income options',
          uiSchema: pages.spouseAdditionalIncomeCheckList.uiSchema,
          schema: pages.spouseAdditionalIncomeCheckList.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData['view:enhancedFinancialStatusReport'],
        },
        spouseAdditionalIncomeValues: {
          path: 'spouse-additional-income-values',
          title: 'Additional income values',
          uiSchema: pages.spouseAdditionalIncomeValues.uiSchema,
          schema: pages.spouseAdditionalIncomeValues.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.additionalIncome?.spouse?.spAddlIncome?.length > 0 &&
            formData['view:enhancedFinancialStatusReport'],
        },
        dependents: {
          path: 'dependents',
          title: 'Dependents',
          uiSchema: pages.dependents.uiSchema,
          schema: pages.dependents.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        dependentCount: {
          path: 'dependents-count',
          title: 'Dependents',
          uiSchema: pages.dependents.uiSchemaEnhanced,
          schema: pages.dependents.schemaEnhanced,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        dependentRecords: {
          path: 'dependent-records',
          title: 'Dependents',
          uiSchema: pages.dependentRecords.uiSchema,
          schema: pages.dependentRecords.schema,
          depends: formData =>
            !formData['view:enhancedFinancialStatusReport'] &&
            formData.questions?.hasDependents,
          editModeOnReviewPage: true,
        },
        dependentAges: {
          path: 'dependent-ages',
          title: 'Dependents',
          uiSchema: pages.dependentRecords.uiSchemaEnhanced,
          schema: pages.dependentRecords.schemaEnhanced,
          depends: formData =>
            formData['view:enhancedFinancialStatusReport'] &&
            formData.questions?.hasDependents > 0,
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        monetaryChecklist: {
          path: 'monetary-asset-checklist',
          title: 'Monetary asset options',
          uiSchema: pages.monetaryChecklist.uiSchema,
          schema: pages.monetaryChecklist.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        monetaryValues: {
          path: 'monetary-asset-values',
          title: 'Monetary asset values',
          uiSchema: pages.monetaryValues.uiSchema,
          schema: pages.monetaryValues.schema,
          depends: formData =>
            formData['view:enhancedFinancialStatusReport'] &&
            formData.assets?.monetaryAssets?.length > 0,
        },
        realEstate: {
          path: 'real-estate-assets',
          title: 'Real estate',
          uiSchema: pages.realEstate.uiSchema,
          schema: pages.realEstate.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        realEstateRecords: {
          path: 'real-estate-asset-records',
          title: 'Real estate',
          uiSchema: pages.realEstateRecords.uiSchema,
          schema: pages.realEstateRecords.schema,
          depends: formData =>
            formData.questions.hasRealEstate &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        enhancedRealEstate: {
          path: 'enhanced-real-estate-assets',
          title: 'Real estate',
          uiSchema: pages.enhancedRealEstate.uiSchema,
          schema: pages.enhancedRealEstate.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: false,
        },
        enhancedRealEstateRecords: {
          path: 'enhanced-real-estate-asset-records',
          title: 'Real estate',
          uiSchema: pages.enhancedRealEstateRecords.uiSchema,
          schema: pages.enhancedRealEstateRecords.schema,
          depends: formData =>
            formData.questions.hasRealEstate &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: false,
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
          depends: formData =>
            formData.questions.hasVehicle &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        enhancedVehicleRecords: {
          path: 'your-vehicle-records',
          title: 'Vehicles',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasVehicle &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedVehicleRecord,
          CustomPageReview: null,
        },
        vehiclesSummary: {
          path: 'vehicles-summary',
          title: 'Your car or other vehicle',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasVehicle &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: VehicleSummaryWidget,
          CustomPageReview: null,
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        otherAssetRecords: {
          path: 'other-asset-records',
          title: 'Other assets',
          uiSchema: pages.otherAssetRecords.uiSchema,
          schema: pages.otherAssetRecords.schema,
          depends: formData =>
            formData.questions.hasOtherAssets &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        // Other Household Assets
        otherAssetsChecklist: {
          path: 'other-assets-checklist',
          title: 'Other assets options',
          uiSchema: pages.otherAssetPages.otherAssetsChecklist.uiSchema,
          schema: pages.otherAssetPages.otherAssetsChecklist.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        otherAssetsValues: {
          path: 'other-assets-values',
          title: 'Other assets values',
          uiSchema: pages.otherAssetPages.otherAssetsValues.uiSchema,
          schema: pages.otherAssetPages.otherAssetsValues.schema,
          depends: formData =>
            !!formData.assets?.otherAssets?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        otherAssetsSummary: {
          path: 'other-assets-summary',
          title: 'Other assets summary',
          CustomPage: OtherAssetsSummary,
          CustomPageReview: OtherAssetsSummaryReview,
          editModeOnReviewPage: true,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            !!formData.assets?.otherAssets?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        addOtherAsset: {
          path: 'add-other-asset',
          title: 'Add your additional assets',
          CustomPage: AddAsset,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // accessed from otherAssetsSummary
        },
      },
    },
    householdExpensesChapter: {
      title: 'Household expenses',
      pages: {
        expensesExplainer: {
          path: 'expenses-explainer',
          title: 'Household expenses explainer',
          uiSchema: pages.expensesExplainer.uiSchema,
          schema: pages.expensesExplainer.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        expenses: {
          path: 'expenses',
          title: 'Expenses',
          uiSchema: pages.expenses.uiSchema,
          schema: pages.expenses.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        householdExpensesChecklist: {
          path: 'household-expenses-checklist',
          title: 'Household expenses checklist',
          uiSchema: pages.householdExpensesChecklist.uiSchema,
          schema: pages.householdExpensesChecklist.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        householdExpensesInputList: {
          path: 'household-expenses-values',
          title: 'Household expenses values',
          uiSchema: pages.householdExpensesInputList.uiSchema,
          schema: pages.householdExpensesInputList.schema,
          depends: formData =>
            formData.expenses?.expenseRecords?.length > 0 &&
            formData['view:enhancedFinancialStatusReport'],
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
        optionExplainer: {
          path: 'option-explainer',
          title: 'Resolution Option Explainer',
          uiSchema: pages.resolutionExplainer.uiSchema,
          schema: pages.resolutionExplainer.schema,
        },
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
          depends: formData =>
            formData.questions.hasBeenAdjudicatedBankrupt &&
            !formData['view:enhancedFinancialStatusReport'],
        },
        enhancedBankruptcyHistoryRecords: {
          path: 'enhanced-bankruptcy-history-records',
          title: 'Bankruptcy history',
          uiSchema: pages.enhancedBankruptcyHistoryRecords.uiSchema,
          schema: pages.enhancedBankruptcyHistoryRecords.schema,
          depends: formData =>
            formData.questions.hasBeenAdjudicatedBankrupt &&
            formData['view:enhancedFinancialStatusReport'],
        },
      },
    },
  },
};

export default formConfig;
