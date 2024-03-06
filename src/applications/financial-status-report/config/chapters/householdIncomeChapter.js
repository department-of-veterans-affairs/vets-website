import {
  benefits,
  additionalIncomeValues,
  spouseBenefits,
  spouseBenefitRecords,
  spouseAdditionalIncomeValues,
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
import EmploymentWorkDates from '../../components/employment/EmploymentWorkDates';
import SpouseEmploymentWorkDates from '../../components/employment/SpouseEmploymentWorkDates';
import OtherIncomeSummaryReview from '../../components/householdIncome/OtherIncomeSummaryReview';
import EmploymentHistorySummaryReview from '../../components/employment/EmploymentHistorySummaryReview';
import EmploymentQuestionReview from '../../components/employment/EmploymentQuestionReview';

export default {
  householdIncomeChapter: {
    title: 'Household income',
    pages: {
      employmentQuestion: {
        path: 'employment-question',
        title: 'Employment',
        CustomPage: EmploymentQuestion,
        CustomPageReview: EmploymentQuestionReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      enhancedEmploymentRecords: {
        path: 'enhanced-employment-records',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData?.questions?.vetIsEmployed,
        editModeOnReviewPage: true,
        CustomPage: EnhancedEmploymentRecord,
        CustomPageReview: null,
      },
      employmentWorkDates: {
        path: 'employment-work-dates',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData?.questions?.vetIsEmployed,
        editModeOnReviewPage: true,
        CustomPage: EmploymentWorkDates,
        CustomPageReview: null,
      },
      grossMonthlyIncome: {
        path: 'gross-monthly-income',
        title: 'Gross monthly income',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData?.questions?.vetIsEmployed,
        editModeOnReviewPage: true,
        CustomPage: GrossMonthlyIncomeInput,
        CustomPageReview: null,
      },
      payrollDeductionChecklist: {
        path: 'deduction-checklist',
        title: 'Payroll deductions',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData?.questions?.vetIsEmployed,
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
        depends: formData => formData?.questions?.vetIsEmployed,
        CustomPage: PayrollDeductionInputList,
        CustomPageReview: null,
      },
      // loop ends with option to re enter here
      employmentHistorySummary: {
        path: 'employment-history',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData.questions.vetIsEmployed,
        editModeOnReviewPage: true,
        CustomPage: EmploymentHistoryWidget,
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      benefitsEnhanced: {
        path: 'your-benefits',
        title: 'Benefits',
        uiSchema: benefits.enhancedUiSchema,
        schema: benefits.enhancedSchema,
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
      },
      additionalIncomeValues: {
        path: 'additional-income-values',
        title: 'Additional income values',
        uiSchema: additionalIncomeValues.uiSchema,
        schema: additionalIncomeValues.schema,
        depends: formData => formData.additionalIncome?.addlIncRecords?.length,
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
        depends: formData => formData.additionalIncome?.addlIncRecords?.length,
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
      spouseEmploymentQuestion: {
        path: 'enhanced-spouse-employment-question',
        title: 'Spouse employment',
        CustomPage: SpouseEmploymentQuestion,
        CustomPageReview: EmploymentQuestionReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => formData.questions.isMarried,
        editModeOnReviewPage: false,
      },
      enhancedSpouseEmploymentRecords: {
        path: 'enhanced-spouse-employment-records',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.isMarried && formData.questions.spouseIsEmployed,
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
          // remove feature flag depends
          formData.questions.spouseIsEmployed,
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
          formData.questions.isMarried && formData.questions.spouseIsEmployed,
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
          // remove feature flag depends
          formData.questions.isMarried && formData.questions.spouseIsEmployed,
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
          formData.questions.isMarried && formData.questions.spouseIsEmployed,
        CustomPage: SpousePayrollDeductionInputList,
        CustomPageReview: null,
      },
      spouseEmploymentHistory: {
        path: 'spouse-employment-history',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.isMarried && formData.questions.spouseIsEmployed,
        editModeOnReviewPage: true,
        CustomPage: SpouseEmploymentHistoryWidget,
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      // whats the deal with this path?
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
        depends: formData => formData.questions.isMarried,
      },
      spouseAdditionalIncomeValues: {
        path: 'spouse-additional-income-values',
        title: 'Additional income values',
        uiSchema: spouseAdditionalIncomeValues.uiSchema,
        schema: spouseAdditionalIncomeValues.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.additionalIncome?.spouse?.spAddlIncome?.length > 0,
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
          formData.additionalIncome?.spouse?.spAddlIncome?.length > 0,
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
    },
  },
};
