import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
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
import EnhancedBenefitsEdit from '../components/EnhancedBenefitsEdit';
import VehicleSummaryWidget from '../pages/assets/vehicles/VehicleSummaryWidget';
import CreditCardBill from '../components/CreditCardBill';
import CreditCardBillSummary from '../pages/expenses/creditCardBills/CreditCardBillSummary';
import AddAsset from '../components/otherAssets/AddAsset';
import OtherAssetsSummary from '../components/otherAssets/OtherAssetsSummary';
import OtherAssetsSummaryReview from '../components/otherAssets/OtherAssetsSummaryReview';
import AddUtilityBill from '../components/utilityBills/AddUtilityBill';
import UtilityBillSummary from '../components/utilityBills/UtilityBillSummary';
import UtilityBillSummaryReview from '../components/utilityBills/UtilityBillSummaryReview';
import AddOtherExpense from '../components/otherExpenses/AddOtherExpense';
import OtherExpensesSummary from '../components/otherExpenses/OtherExpensesSummary';
import OtherExpensesSummaryReview from '../components/otherExpenses/OtherExpensesSummaryReview';
import submitForm from './submitForm';
import SpouseEmploymentHistoryWidget from '../pages/income/employmentEnhanced/SpouseEmploymentHistoryWidget';
import SpouseEmploymentQuestion from '../components/SpouseEmploymentQuestion';
import EmploymentQuestion from '../components/EmploymentQuestion';
import InstallmentContract from '../components/InstallmentContract';
import InstallmentContractSummary from '../pages/expenses/repayments/InstallmentContractSummary';
import OtherIncomeSummary from '../components/OtherIncomeSummary';
import AddIncome from '../components/AddIncome';
import SpouseOtherIncomeSummary from '../components/SpouseOtherIncomeSummary';
import SpouseAddIncome from '../components/SpouseAddIncome';
import ContactInfo, {
  customContactFocus,
} from '../components/contactInfo/ContactInfo';
import ContactInfoReview from '../components/contactInfo/ContactInfoReview';
import {
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../components/contactInfo/EditContactInfo';
import DependentAges from '../components/DependentAges';
import DependentAgesReview from '../components/DependentAgesReview';
import EmploymentWorkDates from '../components/EmploymentWorkDates';
import SpouseEmploymentWorkDates from '../components/SpouseEmploymentWorkDates';

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
  downtime: {
    dependencies: [
      externalServices.mvi,
      externalServices.vbs,
      externalServices.dmc,
      externalServices.vaProfile,
    ],
  },
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
  subTitle: 'Financial Status Report (VA Form 5655)',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  customText: {
    finishAppLaterMessage: 'Finish this request later',
    reviewPageTitle: 'Review your request',
    submitButtonText: 'Submit your request',
  },
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        currentContactInformation: {
          title: 'Contact information',
          path: 'current-contact-information',
          CustomPage: ContactInfo,
          CustomPageReview: ContactInfoReview,
          uiSchema: pages.contactInformation.uiSchema,
          schema: pages.contactInformation.schema,
          // needs useCustomScrollAndFocus: true to work
          scrollAndFocusTarget: customContactFocus,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        editMobilePhone: {
          title: 'Edit mobile phone number',
          path: 'edit-mobile-phone',
          CustomPage: EditMobilePhone,
          CustomPageReview: EditMobilePhone,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editEmailAddress: {
          title: 'Edit email address',
          path: 'edit-email-address',
          CustomPage: EditEmail,
          CustomPageReview: EditEmail,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editMailingAddress: {
          title: 'Edit mailing address',
          path: 'edit-mailing-address',
          CustomPage: EditAddress,
          CustomPageReview: EditAddress,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
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
        employmentQuestion: {
          path: 'employment-question',
          title: 'Employment',
          CustomPage: EmploymentQuestion,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        enhancedEmploymentRecords: {
          path: 'enhanced-employment-records',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedEmploymentRecord,
          CustomPageReview: null,
        },
        employmentWorkDates: {
          path: 'employment-work-dates',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EmploymentWorkDates,
          CustomPageReview: null,
        },
        grossMonthlyIncome: {
          path: 'gross-monthly-income',
          title: 'Gross monthly income',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: GrossMonthlyIncomeInput,
          CustomPageReview: null,
        },
        payrollDeductionChecklist: {
          path: 'deduction-checklist',
          title: 'Payroll deductions',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: PayrollDeductionChecklist,
          CustomPageReview: null,
        },
        payrollDeductionInputList: {
          title: 'Deduction amounts',
          path: 'deduction-values',
          // listOfIssues defined in next section
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          // needed to bypass bug on review & submit page
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          CustomPage: PayrollDeductionInputList,
          CustomPageReview: null,
        },
        // loop ends with option to re enter here
        employmentHistorySummary: {
          path: 'employment-history',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.vetIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EmploymentHistoryWidget,
          CustomPageReview: null,
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        benefitsEnhanced: {
          path: 'your-benefits',
          title: 'Benefits',
          uiSchema: pages.benefits.enhancedUiSchema,
          schema: pages.benefits.enhancedSchema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        editBenefitsEnhanced: {
          path: 'edit-benefits',
          title: 'Benefits',
          CustomPage: EnhancedBenefitsEdit,
          CustomPageReview: null, // TODO: Add review page (or check if reviewpage on normal)
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // only accessible from benefits page
          returnUrl: 'your-benefits',
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
        otherIncomeSummary: {
          path: 'other-income-summary',
          title: 'Other income summary',
          CustomPage: OtherIncomeSummary,
          CustomPageReview: null,
          editModeOnReviewPage: true,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.additionalIncome?.addlIncRecords?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        addOtherIncome: {
          path: 'add-other-income',
          title: 'Add your other sources of income',
          CustomPage: AddIncome,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // accessed from otherIncomeSummary
        },
        spouseInformation: {
          path: 'spouse-information',
          title: 'Spouse information',
          uiSchema: pages.spouseInformation.uiSchema,
          schema: pages.spouseInformation.schema,
        },
        spouseName: {
          path: 'spouse-name',
          title: 'Spouse name',
          uiSchema: pages.spouseName.uiSchema,
          schema: pages.spouseName.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData['view:enhancedFinancialStatusReport'],
        },
        spouseEmploymentQuestion: {
          path: 'enhanced-spouse-employment-question',
          title: 'Spouse employment',
          CustomPage: SpouseEmploymentQuestion,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.isMarried &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: false,
        },
        enhancedSpouseEmploymentRecords: {
          path: 'enhanced-spouse-employment-records',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedSpouseEmploymentRecord,
          CustomPageReview: null,
        },
        spouseEmploymentWorkDates: {
          path: 'spouse-employment-work-dates',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpouseEmploymentWorkDates,
          CustomPageReview: null,
        },
        enhancedSpouseGrossMonthlyIncome: {
          path: 'spouse-gross-monthly-income',
          title: 'Gross monthly income',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpouseGrossMonthlyIncomeInput,
          CustomPageReview: null,
        },
        spousePayrollDeductionChecklist: {
          path: 'spouse-deduction-checklist',
          title: 'Payroll deductions',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpousePayrollDeductionChecklist,
          CustomPageReview: null,
        },
        spousePayrollDeductionInputList: {
          title: 'Spouse deduction amounts',
          path: 'spouse-deduction-values',
          // listOfIssues defined in next section
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          // needed to bypass bug on review & submit page
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          CustomPage: SpousePayrollDeductionInputList,
          CustomPageReview: null,
        },
        spouseEmploymentHistory: {
          path: 'spouse-employment-history',
          title: 'Employment',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.spouseIsEmployed &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: SpouseEmploymentHistoryWidget,
          CustomPageReview: null,
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
          depends: formData => formData.questions.isMarried,
        },
        spouseBenefitRecords: {
          path: 'spouse-benefit-records',
          title: 'Spouse benefits',
          uiSchema: pages.spouseBenefitRecords.uiSchema,
          schema: pages.spouseBenefitRecords.schema,
          depends: formData =>
            formData.questions.isMarried &&
            formData.questions.spouseHasBenefits,
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
        spouseOtherIncomeSummary: {
          path: 'spouse-other-income-summary',
          title: 'Spouse other income summary',
          CustomPage: SpouseOtherIncomeSummary,
          CustomPageReview: null,
          editModeOnReviewPage: true,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.isMarried &&
            formData.additionalIncome?.spouse?.spAddlIncome?.length > 0 &&
            formData['view:enhancedFinancialStatusReport'],
        },
        spouseAddOtherIncome: {
          path: 'spouse-add-other-income',
          title: 'Add your other sources of income',
          CustomPage: SpouseAddIncome,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // accessed from spouseOtherIncomeSummary
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
          uiSchema: {},
          schema: pages.dependentRecords.schemaEnhanced,
          depends: formData =>
            formData['view:enhancedFinancialStatusReport'] &&
            formData.questions?.hasDependents &&
            formData.questions.hasDependents !== '0',
          CustomPage: DependentAges,
          CustomPageReview: DependentAgesReview,
          editModeOnReviewPage: false,
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
            !formData.assets?.automobiles?.length &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: EnhancedVehicleRecord,
          CustomPageReview: null,
          returnUrl: '/vehicles-summary',
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
          editModeOnReviewPage: false,
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
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        utilityRecords: {
          path: 'utility-records',
          title: 'Utilities',
          uiSchema: pages.utilityRecords.uiSchema,
          schema: pages.utilityRecords.schema,
          depends: formData =>
            formData.questions.hasUtilities &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        // Enhanced Utility Bills
        utilityBillChecklist: {
          path: 'utility-bill-checklist',
          title: 'Utility bill options',
          uiSchema: pages.utilityBillPages.utilityBillChecklist.uiSchema,
          schema: pages.utilityBillPages.utilityBillChecklist.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        utilityBillValues: {
          path: 'utility-bill-values',
          title: 'Utility bill values',
          uiSchema: pages.utilityBillPages.utilityBillValues.uiSchema,
          schema: pages.utilityBillPages.utilityBillValues.schema,
          depends: formData =>
            !!formData.utilityRecords?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        utilityBillSummary: {
          path: 'utility-bill-summary',
          title: 'Utility bills summary',
          CustomPage: UtilityBillSummary,
          CustomPageReview: UtilityBillSummaryReview,
          editModeOnReviewPage: true,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            !!formData.utilityRecords?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        addUtilityBill: {
          path: 'add-utility-bill',
          title: 'Add your utility bills',
          CustomPage: AddUtilityBill,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // accessed from utilityBillSummary
        },
        repayments: {
          path: 'repayments',
          title: 'Repayments',
          uiSchema: pages.repayments.uiSchema,
          schema: pages.repayments.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        repaymentRecords: {
          path: 'repayment-records',
          title: 'Repayments',
          uiSchema: pages.repaymentRecords.uiSchema,
          schema: pages.repaymentRecords.schema,
          depends: formData =>
            formData.questions.hasRepayments &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        creditCardBills: {
          path: 'credit-card-bills',
          title: 'Credit card bills',
          uiSchema: pages.creditCardBills.uiSchema,
          schema: pages.creditCardBills.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        addEditCreditCardBills: {
          path: 'your-credit-card-bills',
          title: 'Credit card bills',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasCreditCardBills &&
            !formData.expenses?.creditCardBills?.length &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: CreditCardBill,
          CustomPageReview: null,
        },
        creditCardBillSummary: {
          path: 'credit-card-bills-summary',
          title: 'Credit card bills',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasCreditCardBills &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: CreditCardBillSummary,
          CustomPageReview: null,
        },
        installmentContracts: {
          path: 'installment-contracts',
          title: 'Installment Contracts',
          uiSchema: pages.installmentContracts.uiSchema,
          schema: pages.installmentContracts.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        addEditInstallmentContract: {
          path: 'your-installment-contracts',
          title: 'Installment contracts',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasRepayments &&
            !formData?.installmentContracts?.length &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: InstallmentContract,
          CustomPageReview: null,
        },
        installmentContractSummary: {
          path: 'installment-contracts-summary',
          title: 'Installment contracts',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            formData.questions.hasRepayments &&
            formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
          CustomPage: InstallmentContractSummary,
          CustomPageReview: null,
        },
        otherExpenses: {
          path: 'other-expenses',
          title: 'Other expenses',
          uiSchema: pages.otherExpenses.uiSchema,
          schema: pages.otherExpenses.schema,
          depends: formData => !formData['view:enhancedFinancialStatusReport'],
        },
        otherExpenseRecords: {
          path: 'other-expense-records',
          title: 'Other expenses',
          uiSchema: pages.otherExpenseRecords.uiSchema,
          schema: pages.otherExpenseRecords.schema,
          depends: formData =>
            formData.questions.hasOtherExpenses &&
            !formData['view:enhancedFinancialStatusReport'],
          editModeOnReviewPage: true,
        },
        // Start Other Living Expenses
        otherExpensesChecklist: {
          path: 'other-expenses-checklist',
          title: 'Other expense options',
          uiSchema: pages.otherExpensesPages.otherExpensesChecklist.uiSchema,
          schema: pages.otherExpensesPages.otherExpensesChecklist.schema,
          depends: formData => formData['view:enhancedFinancialStatusReport'],
        },
        otherExpensesValues: {
          path: 'other-expenses-values',
          title: 'Other expense values',
          uiSchema: pages.otherExpensesPages.otherExpensesValues.uiSchema,
          schema: pages.otherExpensesPages.otherExpensesValues.schema,
          depends: formData =>
            !!formData.otherExpenses?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        otherExpensesSummary: {
          path: 'other-expenses-summary',
          title: 'Other living expenses',
          CustomPage: OtherExpensesSummary,
          CustomPageReview: OtherExpensesSummaryReview,
          editModeOnReviewPage: true,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: formData =>
            !!formData.otherExpenses?.length &&
            formData['view:enhancedFinancialStatusReport'],
        },
        addOtherExpenses: {
          path: 'add-other-expense',
          title: 'Add your additional expense',
          CustomPage: AddOtherExpense,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
          depends: () => false, // accessed from otherExpensesSummary
          returnUrl: 'other-expenses-summary',
        },
        // End Other Living Expenses
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
          depends: formData => {
            return (
              formData.selectedDebtsAndCopays?.length > 0 &&
              formData['view:combinedFinancialStatusReport']
            );
          },
          path: 'resolution-option/:index',
          showPagePerItem: true,
          arrayPath: 'selectedDebtsAndCopays',
          uiSchema: pages.resolutionOption.uiSchema,
          schema: pages.resolutionOption.schema,
        },
        resolutionComment: {
          title: 'Resolution Amount',
          depends: formData =>
            formData.selectedDebtsAndCopays?.length > 0 &&
            formData['view:combinedFinancialStatusReport'],
          itemFilter: item => item.resolutionOption !== 'waiver',
          path: 'resolution-comment/:index',
          showPagePerItem: true,
          arrayPath: 'selectedDebtsAndCopays',
          uiSchema: pages.resolutionComment.uiSchema,
          schema: pages.resolutionComment.schema,
        },
        resolutionWaiverCheck: {
          title: 'Resolution Waiver Agreement',
          depends: formData =>
            formData.selectedDebtsAndCopays?.length > 0 &&
            formData['view:combinedFinancialStatusReport'],
          itemFilter: item => item.resolutionOption === 'waiver',
          path: 'resolution-waiver-agreement/:index',
          showPagePerItem: true,
          arrayPath: 'selectedDebtsAndCopays',
          uiSchema: pages.resolutionWaiverAgreement.uiSchema,
          schema: pages.resolutionWaiverAgreement.schema,
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
