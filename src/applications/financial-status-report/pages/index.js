import * as veteranInfo from './veteran/veteranInfo';
import * as contactInfo from './veteran/contact';
import * as availableDebts from './veteran/debts';
import * as combinedDebts from './veteran/combinedDebts';
import * as employment from './income/employment';
import * as employmentRecords from './income/employment/records';
import * as additionalIncomeRecords from './income/additionalIncome/records';
import * as income from './income/currentIncome';
import * as benefits from './income/benefits';
import * as socialSecurity from './income/socialSecurity';
import * as socialSecurityRecords from './income/socialSecurity/records';
import * as additionalIncome from './income/additionalIncome';
import * as additionalIncomeChecklist from './income/additionalIncome/additionalIncomeChecklist';
import * as additionalIncomeValues from './income/additionalIncome/additionalIncomeValues';
import * as spouseInformation from './income/spouse/spouseInfo';
import * as spouseSocialSecurity from './income/spouse/socialSecurity';
import * as spouseSocialSecurityRecords from './income/spouse/socialSecurity/records';
import * as spouseAdditionalIncome from './income/spouse/additionalIncome';
import * as spouseAdditionalIncomeRecords from './income/spouse/additionalIncome/records';
import * as spouseBenefits from './income/spouse/benefits';
import * as spouseBenefitRecords from './income/spouse/benefits/records';
import * as spouseEmployment from './income/spouse/employment';
import * as spouseEmploymentRecords from './income/spouse/employment/records';
import * as spouseIncome from './income/spouse/currentIncome';
import * as dependents from './income/dependents';
import * as dependentRecords from './income/dependents/records';
import * as monetary from './assets/monetary';
import * as monetaryChecklist from './assets/monetary/monetaryChecklist';
import * as monetaryValues from './assets/monetary/monetaryValues';
import * as realEstate from './assets/realEstate';
import * as realEstateRecords from './assets/realEstate/records';
import * as recreationalVehicles from './assets/recreationalVehicles';
import * as recreationalVehicleRecords from './assets/recreationalVehicles/records';
import * as vehicles from './assets/vehicles';
import * as vehicleRecords from './assets/vehicles/records';
import * as otherAssets from './assets/other';
import * as otherAssetRecords from './assets/other/records';
import * as expenses from './expenses/household';
import * as utilities from './expenses/utilities';
import * as utilityRecords from './expenses/utilities/records';
import * as repayments from './expenses/repayments';
import * as repaymentRecords from './expenses/repayments/records';
import * as otherExpenses from './expenses/other';
import * as otherExpenseRecords from './expenses/other/records';
import * as resolutionOptions from './resolution/options';
import * as resolutionOption from './resolution/resolutionOption';
import * as resolutionComments from './resolution/comments';
import * as resolutionComment from './resolution/resolutionComment';
import * as bankruptcyHistory from './bankruptcy';
import * as bankruptcyHistoryRecords from './bankruptcy/records';
import * as enhancedBankruptcyHistoryRecords from './bankruptcy/enhancedRecords';
import * as addIssue from './income/employmentEnhanced/addIssue';
import * as employmentHistory from './income/employmentEnhanced/employmentHistory';
import * as payrollDeductionChecklist from './income/employmentEnhanced/payrollDeductionChecklist';
import * as payrollDeductionInputList from './income/employmentEnhanced/payrollDeductionInputList';
import * as grossMonthlyIncome from './income/employmentEnhanced/grossMonthlyIncome';
import * as enhancedEmploymentRecords from './income/employmentEnhanced/enhancedRecords';
import * as resolutionExplainer from './resolution/resolutionExplainer';
import * as householdExpensesChecklist from './expenses/householdExpensesChecklist';
import * as householdExpensesInputList from './expenses/householdExpensesValues';
import * as expensesExplainer from './expenses/expensesExplainer';
import * as contactInformation from './veteran/contactInformation';

export {
  veteranInfo,
  availableDebts,
  combinedDebts,
  employment,
  employmentRecords,
  income,
  benefits,
  socialSecurity,
  socialSecurityRecords,
  additionalIncome,
  additionalIncomeRecords,
  additionalIncomeChecklist,
  additionalIncomeValues,
  spouseAdditionalIncome,
  spouseAdditionalIncomeRecords,
  spouseInformation,
  spouseBenefits,
  spouseBenefitRecords,
  spouseEmployment,
  spouseEmploymentRecords,
  spouseIncome,
  spouseSocialSecurity,
  spouseSocialSecurityRecords,
  dependents,
  dependentRecords,
  monetary,
  monetaryChecklist,
  monetaryValues,
  realEstate,
  realEstateRecords,
  recreationalVehicles,
  recreationalVehicleRecords,
  vehicles,
  vehicleRecords,
  otherAssets,
  otherAssetRecords,
  expenses,
  utilities,
  utilityRecords,
  repayments,
  repaymentRecords,
  otherExpenses,
  otherExpenseRecords,
  resolutionOptions,
  resolutionOption,
  resolutionComments,
  resolutionComment,
  bankruptcyHistory,
  bankruptcyHistoryRecords,
  contactInfo,
  addIssue,
  employmentHistory,
  payrollDeductionChecklist,
  payrollDeductionInputList,
  grossMonthlyIncome,
  enhancedEmploymentRecords,
  resolutionExplainer,
  householdExpensesChecklist,
  householdExpensesInputList,
  expensesExplainer,
  enhancedBankruptcyHistoryRecords,
  contactInformation,
};
