import {
  benefits,
  additionalIncomeChecklist,
  additionalIncomeValues,
  spouseName,
  spouseInformation,
  spouseBenefits,
  spouseBenefitRecords,
  spouseAdditionalIncomeCheckList,
  spouseAdditionalIncomeValues,
  dependents,
  dependentRecords,
} from '../../../pages';

import EnhancedEmploymentRecord from '../../../components/EnhancedEmploymentRecord';
import EnhancedSpouseEmploymentRecord from '../../../components/EnhancedSpouseEmploymentRecord';
import GrossMonthlyIncomeInput from '../../../components/GrossMonthlyIncomeInput';
import SpouseGrossMonthlyIncomeInput from '../../../components/SpouseGrossMonthlyIncomeInput';
import SpousePayrollDeductionChecklist from '../../../components/SpousePayrollDeductionChecklist';
import SpousePayrollDeductionInputList from '../../../components/SpousePayrollDeductionInputList';
import PayrollDeductionChecklist from '../../../components/PayrollDeductionChecklist';
import PayrollDeductionInputList from '../../../components/PayrollDeductionInputList';
import EmploymentHistoryWidget from '../../../pages/income/employmentEnhanced/EmploymentHistoryWidget';
import EnhancedBenefitsEdit from '../../../components/EnhancedBenefitsEdit';
import SpouseEmploymentHistoryWidget from '../../../pages/income/employmentEnhanced/SpouseEmploymentHistoryWidget';
import SpouseEmploymentQuestion from '../../../components/SpouseEmploymentQuestion';
import EmploymentQuestion from '../../../components/EmploymentQuestion';
import OtherIncomeSummary from '../../../components/OtherIncomeSummary';
import AddIncome from '../../../components/AddIncome';
import SpouseOtherIncomeSummary from '../../../components/SpouseOtherIncomeSummary';
import SpouseAddIncome from '../../../components/SpouseAddIncome';
import DependentAges from '../../../components/DependentAges';
import DependentAgesReview from '../../../components/DependentAgesReview';
import EmploymentWorkDates from '../../../components/EmploymentWorkDates';
import SpouseEmploymentWorkDates from '../../../components/SpouseEmploymentWorkDates';
import OtherIncomeSummaryReview from '../../../components/otherIncome/OtherIncomeSummaryReview';
import EmploymentHistorySummaryReview from '../../../components/householdIncome/EmploymentHistorySummaryReview';
import EmploymentQuestionSummaryReview from '../../../components/householdIncome/EmploymentQuestionSummaryReview';

import { isStreamlinedHouseholdIncome } from '../../../utils/depends';

export default {
  householdIncomeChapter: {
    title: 'Household income',
    depends: formData => isStreamlinedHouseholdIncome(formData),
    pages: {
      spouseInformation: {
        path: 'spouse-information',
        title: 'Spouse information',
        uiSchema: spouseInformation.uiSchema,
        schema: spouseInformation.schema,
        depends: formData => isStreamlinedHouseholdIncome(formData),
      },
      spouseName: {
        path: 'spouse-name',
        title: 'Spouse name',
        uiSchema: spouseName.uiSchema,
        schema: spouseName.schema,
        depends: formData =>
          formData.questions.isMarried &&
          isStreamlinedHouseholdIncome(formData),
      },
      dependentCount: {
        path: 'dependents-count',
        title: 'Dependents',
        uiSchema: dependents.uiSchemaEnhanced,
        schema: dependents.schemaEnhanced,
        depends: formData => isStreamlinedHouseholdIncome(formData),
      },
      dependentAges: {
        path: 'dependent-ages',
        title: 'Dependents',
        uiSchema: {},
        schema: dependentRecords.schemaEnhanced,
        depends: formData =>
          isStreamlinedHouseholdIncome(formData) &&
          formData.questions?.hasDependents &&
          formData.questions.hasDependents !== '0',
        CustomPage: DependentAges,
        CustomPageReview: DependentAgesReview,
        editModeOnReviewPage: false,
      },
      employmentQuestion: {
        path: 'employment-question',
        title: 'Employment',
        CustomPage: EmploymentQuestion,
        CustomPageReview: EmploymentQuestionSummaryReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => isStreamlinedHouseholdIncome(formData),
      },
      enhancedEmploymentRecords: {
        path: 'enhanced-employment-records',
        title: 'Employment',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.vetIsEmployed &&
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
        editModeOnReviewPage: true,
        CustomPage: EmploymentHistoryWidget,
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      benefitsEnhanced: {
        path: 'your-benefits',
        title: 'Benefits',
        uiSchema: benefits.enhancedUiSchema,
        schema: benefits.enhancedSchema,
        depends: formData => isStreamlinedHouseholdIncome(formData),
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
      additionalIncomeChecklist: {
        path: 'additional-income-checklist',
        title: 'Additional income options',
        uiSchema: additionalIncomeChecklist.uiSchema,
        schema: additionalIncomeChecklist.schema,
        depends: formData => isStreamlinedHouseholdIncome(formData),
      },
      additionalIncomeValues: {
        path: 'additional-income-values',
        title: 'Additional income values',
        uiSchema: additionalIncomeValues.uiSchema,
        schema: additionalIncomeValues.schema,
        depends: formData =>
          formData.additionalIncome?.addlIncRecords?.length &&
          isStreamlinedHouseholdIncome(formData),
      },
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
          isStreamlinedHouseholdIncome(formData),
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
        CustomPageReview: EmploymentQuestionSummaryReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.isMarried &&
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
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
          isStreamlinedHouseholdIncome(formData),
        editModeOnReviewPage: true,
        CustomPage: SpouseEmploymentHistoryWidget,
        CustomPageReview: EmploymentHistorySummaryReview,
      },
      spouseBenefits: {
        path: 'spouse-benefits',
        title: 'Spouse benefits',
        uiSchema: spouseBenefits.uiSchema,
        schema: spouseBenefits.schema,
        depends: formData =>
          formData.questions.isMarried &&
          isStreamlinedHouseholdIncome(formData),
      },
      spouseBenefitRecords: {
        path: 'spouse-benefit-records',
        title: 'Spouse benefits',
        uiSchema: spouseBenefitRecords.uiSchema,
        schema: spouseBenefitRecords.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.questions.spouseHasBenefits &&
          isStreamlinedHouseholdIncome(formData),
      },
      spouseAdditionalIncomeCheckList: {
        path: 'spouse-additional-income-checklist',
        title: 'Additional income options',
        uiSchema: spouseAdditionalIncomeCheckList.uiSchema,
        schema: spouseAdditionalIncomeCheckList.schema,
        depends: formData =>
          formData.questions.isMarried &&
          isStreamlinedHouseholdIncome(formData),
      },
      spouseAdditionalIncomeValues: {
        path: 'spouse-additional-income-values',
        title: 'Additional income values',
        uiSchema: spouseAdditionalIncomeValues.uiSchema,
        schema: spouseAdditionalIncomeValues.schema,
        depends: formData =>
          formData.questions.isMarried &&
          formData.additionalIncome?.spouse?.spAddlIncome?.length > 0 &&
          isStreamlinedHouseholdIncome(formData),
      },
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
          isStreamlinedHouseholdIncome(formData),
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
