import {
  employment,
  employmentRecords,
  income,
  benefits,
  socialSecurity,
  socialSecurityRecords,
  additionalIncome,
  additionalIncomeRecords,
  additionalIncomeValues,
  spouseName,
  spouseEmployment,
  spouseEmploymentRecords,
  spouseInformation,
  spouseIncome,
  spouseBenefits,
  spouseBenefitRecords,
  spouseSocialSecurity,
  spouseSocialSecurityRecords,
  spouseAdditionalIncome,
  spouseAdditionalIncomeRecords,
  spouseAdditionalIncomeValues,
  dependents,
  dependentRecords,
} from '../../pages';

import EnhancedEmploymentRecord from '../../components/employment/EnhancedEmploymentRecord';
import EnhancedSpouseEmploymentRecord from '../../components/employment/EnhancedSpouseEmploymentRecord';
import GrossMonthlyIncomeInput from '../../components/householdIncome/GrossMonthlyIncomeInput';
import SpouseGrossMonthlyIncomeInput from '../../components/householdIncome/SpouseGrossMonthlyIncomeInput';
import SpousePayrollDeductionChecklist from '../../components/householdIncome/SpousePayrollDeductionChecklist';
import SpousePayrollDeductionInputList from '../../components/householdIncome/SpousePayrollDeductionInputList';
import PayrollDeductionChecklist from '../../components/householdIncome/PayrollDeductionChecklist';
import PayrollDeductionInputList from '../../components/householdIncome/PayrollDeductionInputList';
import EmploymentHistoryWidget from '../../components/employment/EmploymentHistoryWidget';
import EnhancedBenefitsEdit from '../../components/debtsAndCopays/EnhancedBenefitsEdit';
import SpouseBenefitRecordsReview from '../../components/householdIncome/SpouseBenefitRecordsReview';
import SpouseEmploymentHistoryWidget from '../../components/employment/SpouseEmploymentHistoryWidget';
import SpouseEmploymentQuestion from '../../components/employment/SpouseEmploymentQuestion';
import EmploymentQuestion from '../../components/employment/EmploymentQuestion';
import AdditionalIncomeCheckList from '../../components/householdIncome/AdditionalIncomeCheckList';
import OtherIncomeSummary from '../../components/householdIncome/OtherIncomeSummary';
import AddIncome from '../../components/householdIncome/AddIncome';
import SpouseAdditionalIncomeCheckList from '../../components/householdIncome/SpouseAdditionalIncomeCheckList';
import SpouseOtherIncomeSummary from '../../components/householdIncome/SpouseOtherIncomeSummary';
import SpouseAddIncome from '../../components/householdIncome/SpouseAddIncome';
import DependentAges from '../../components/household/DependentAges';
import DependentAgesReview from '../../components/household/DependentAgesReview';
import EmploymentWorkDates from '../../components/employment/EmploymentWorkDates';
import SpouseEmploymentWorkDates from '../../components/employment/SpouseEmploymentWorkDates';
import OtherIncomeSummaryReview from '../../components/householdIncome/OtherIncomeSummaryReview';
import EmploymentHistorySummaryReview from '../../components/employment/EmploymentHistorySummaryReview';
import EmploymentQuestionReview from '../../components/employment/EmploymentQuestionReview';

export default {
  householdIncomeChapter: {
    title: 'Household income',
    pages: {
      employment: {
        path: 'employment',
        title: 'Employment',
        uiSchema: employment.uiSchema,
        schema: employment.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      // loop begins
      employmentRecords: {
        path: 'employment-records',
        title: 'Employment',
        uiSchema: employmentRecords.uiSchema,
        schema: employmentRecords.schema,
        depends: formData =>
          formData.questions.vetIsEmployed &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      employmentQuestion: {
        path: 'employment-question',
        title: 'Employment',
        CustomPage: EmploymentQuestion,
        CustomPageReview: EmploymentQuestionReview,
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
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      income: {
        title: 'Income',
        path: 'income/:index',
        arrayPath: 'currEmployment',
        showPagePerItem: true,
        uiSchema: income.uiSchema,
        schema: income.schema,
        editModeOnReviewPage: true,
        depends: formData =>
          formData.questions.vetIsEmployed &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      benefits: {
        path: 'benefits',
        title: 'Benefits',
        uiSchema: benefits.uiSchema,
        schema: benefits.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      benefitsEnhanced: {
        path: 'your-benefits',
        title: 'Benefits',
        uiSchema: benefits.enhancedUiSchema,
        schema: benefits.enhancedSchema,
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
        uiSchema: socialSecurity.uiSchema,
        schema: socialSecurity.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      socialSecurityRecords: {
        path: 'social-security-records',
        title: 'Social Security',
        uiSchema: socialSecurityRecords.uiSchema,
        schema: socialSecurityRecords.schema,
        depends: formData =>
          formData.questions.hasSocialSecurity &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      additionalIncome: {
        path: 'additional-income',
        title: 'Additional income',
        uiSchema: additionalIncome.uiSchema,
        schema: additionalIncome.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      additionalIncomeRecords: {
        path: 'additional-income-records',
        title: 'Additional income',
        uiSchema: additionalIncomeRecords.uiSchema,
        schema: additionalIncomeRecords.schema,
        depends: formData =>
          formData.questions.hasAdditionalIncome &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      // =================================================
      // additionalIncomeChecklist exit point for chapter
      // need to set flag for isStreamlinedShortForm
      // =================================================
      additionalIncomeChecklist: {
        path: 'additional-income-checklist',
        title: 'Additional income options',
        CustomPage: AdditionalIncomeCheckList,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData['view:enhancedFinancialStatusReport'],
      },
      additionalIncomeValues: {
        path: 'additional-income-values',
        title: 'Additional income values',
        uiSchema: additionalIncomeValues.uiSchema,
        schema: additionalIncomeValues.schema,
        depends: formData =>
          formData.additionalIncome?.addlIncRecords?.length &&
          formData['view:enhancedFinancialStatusReport'],
      },
      // =================================================
      // otherIncomeSummary exit point for chapter
      // need to set flag for isStreamlinedShortForm
      // =================================================
      otherIncomeSummary: {
        path: 'other-income-summary',
        title: 'Other income summary',
        CustomPage: OtherIncomeSummary,
        CustomPageReview: OtherIncomeSummaryReview,
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
        uiSchema: spouseInformation.uiSchema,
        schema: spouseInformation.schema,
        depends: formData => !formData['view:streamlinedWaiver'],
      },
      spouseName: {
        path: 'spouse-name',
        title: 'Spouse name',
        uiSchema: spouseName.uiSchema,
        schema: spouseName.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData['view:enhancedFinancialStatusReport'] &&
          !formData['view:streamlinedWaiver'],
      },
      spouseEmploymentQuestion: {
        path: 'enhanced-spouse-employment-question',
        title: 'Spouse employment',
        CustomPage: SpouseEmploymentQuestion,
        CustomPageReview: EmploymentQuestionReview,
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
          formData.questions.isMarried &&
          formData.questions.spouseIsEmployed &&
          formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
        CustomPage: SpouseEmploymentHistoryWidget,
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      spouseEmployment: {
        path: 'spouse-employment',
        title: 'Spouse employment',
        uiSchema: spouseEmployment.uiSchema,
        schema: spouseEmployment.schema,
        depends: formData =>
          formData.questions.isMarried &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      spouseEmploymentRecords: {
        path: 'spouse-employment-records',
        title: 'Spouse employment',
        uiSchema: spouseEmploymentRecords.uiSchema,
        schema: spouseEmploymentRecords.schema,
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
        uiSchema: spouseIncome.uiSchema,
        schema: spouseIncome.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.questions.spouseIsEmployed &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      spouseBenefits: {
        path: 'spouse-benefits',
        title: 'Spouse benefits',
        uiSchema: spouseBenefits.uiSchema,
        schema: spouseBenefits.schema,
        depends: formData => formData.questions.isMarried,
      },
      spouseBenefitRecords: {
        path: 'spouse-benefit-records',
        title: 'Spouse benefits',
        uiSchema: spouseBenefitRecords.uiSchema,
        schema: spouseBenefitRecords.schema,
        depends: formData =>
          formData.questions.isMarried && formData.questions.spouseHasBenefits,
        editModeOnReviewPage: true,
        CustomPageReview: SpouseBenefitRecordsReview,
      },
      spouseSocialSecurity: {
        path: 'spouse-social-security',
        title: 'Spouse Social Security',
        uiSchema: spouseSocialSecurity.uiSchema,
        schema: spouseSocialSecurity.schema,
        depends: formData =>
          formData.questions.isMarried &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      spouseSocialSecurityRecords: {
        path: 'spouse-social-security-records',
        title: 'Spouse Social Security',
        uiSchema: spouseSocialSecurityRecords.uiSchema,
        schema: spouseSocialSecurityRecords.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.questions.spouseHasSocialSecurity &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      spouseAdditionalIncome: {
        path: 'spouse-additional-income',
        title: 'Spouse additional income',
        uiSchema: spouseAdditionalIncome.uiSchema,
        schema: spouseAdditionalIncome.schema,
        depends: formData =>
          formData.questions.isMarried &&
          !formData['view:enhancedFinancialStatusReport'],
      },
      spouseAdditionalIncomeRecords: {
        path: 'spouse-additional-income-records',
        title: 'Spouse additional income',
        uiSchema: spouseAdditionalIncomeRecords.uiSchema,
        schema: spouseAdditionalIncomeRecords.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.questions.spouseHasAdditionalIncome &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      // =================================================
      // spouseAdditionalIncomeCheckList exit point for chapter
      // need to set flag for isStreamlinedShortForm
      // =================================================
      spouseAdditionalIncomeCheckList: {
        path: 'spouse-additional-income-checklist',
        title: 'Additional income options',
        CustomPage: SpouseAdditionalIncomeCheckList,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.isMarried &&
          formData['view:enhancedFinancialStatusReport'],
      },
      spouseAdditionalIncomeValues: {
        path: 'spouse-additional-income-values',
        title: 'Additional income values',
        uiSchema: spouseAdditionalIncomeValues.uiSchema,
        schema: spouseAdditionalIncomeValues.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.additionalIncome?.spouse?.spAddlIncome?.length > 0 &&
          formData['view:enhancedFinancialStatusReport'],
      },
      // =================================================
      // spouseOtherIncomeSummary exit point for chapter
      // need to set flag for isStreamlinedShortForm
      // =================================================
      spouseOtherIncomeSummary: {
        path: 'spouse-other-income-summary',
        title: 'Spouse other income summary',
        CustomPage: SpouseOtherIncomeSummary,
        CustomPageReview: OtherIncomeSummaryReview,
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
        uiSchema: dependents.uiSchema,
        schema: dependents.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !formData['view:streamlinedWaiver'],
      },
      dependentCount: {
        path: 'dependents-count',
        title: 'Dependents',
        uiSchema: dependents.uiSchemaEnhanced,
        schema: dependents.schemaEnhanced,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !formData['view:streamlinedWaiver'],
      },
      dependentRecords: {
        path: 'dependent-records',
        title: 'Dependents',
        uiSchema: dependentRecords.uiSchema,
        schema: dependentRecords.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          formData.questions?.hasDependents &&
          !formData['view:streamlinedWaiver'],
        editModeOnReviewPage: true,
      },
      dependentAges: {
        path: 'dependent-ages',
        title: 'Dependents',
        uiSchema: {},
        schema: dependentRecords.schemaEnhanced,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          formData.questions?.hasDependents &&
          formData.questions.hasDependents !== '0' &&
          !formData['view:streamlinedWaiver'],
        CustomPage: DependentAges,
        CustomPageReview: DependentAgesReview,
        editModeOnReviewPage: false,
      },
    },
  },
};
