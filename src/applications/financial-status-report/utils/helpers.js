import { omit } from 'lodash/fp';

export const getMonthlyIncome = ({
  questions,
  personalData,
  additionalIncome,
  socialSecurity,
  benefits,
}) => {
  const { employmentHistory } = personalData;
  let totalArr = [];

  if (questions.vetIsEmployed) {
    const { grossMonthlyIncome } = employmentHistory.veteran.currentEmployment;
    totalArr = [...totalArr, grossMonthlyIncome];
  }

  if (questions.spouseIsEmployed) {
    const { grossMonthlyIncome } = employmentHistory.spouse.currentEmployment;
    totalArr = [...totalArr, grossMonthlyIncome];
  }

  if (questions.hasAdditionalIncome) {
    const vetAddl = additionalIncome.additionalIncomeRecords.map(
      record => record.monthlyIncome,
    );
    totalArr = [...totalArr, ...vetAddl];
  }

  if (questions.spouseHasAdditionalIncome) {
    const spouseAddl = additionalIncome.spouse.additionalIncomeRecords.map(
      record => record.monthlyIncome,
    );
    totalArr = [...totalArr, ...spouseAddl];
  }

  if (questions.hasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  if (questions.spouseHasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity.spouse;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  if (questions.spouseHasBenefits) {
    const { benefitAmount, educationAmount } = benefits.spouseBenefits;
    totalArr = [...totalArr, benefitAmount, educationAmount];
  }

  return totalArr.reduce((acc, income) => acc + income, 0);
};

export const getMonthlyExpenses = ({
  questions,
  personalData,
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContractsAndOtherDebts,
}) => {
  const { employmentHistory } = personalData;
  let totalArr = [];

  const householdExpenses = Object.values(expenses);
  totalArr = [...totalArr, ...householdExpenses];

  if (questions.vetIsEmployed) {
    const { deductions } = employmentHistory.veteran.currentEmployment;
    const payrollDeductions = deductions.map(
      deduction => deduction.deductionAmount,
    );
    totalArr = [...totalArr, ...payrollDeductions];
  }

  if (questions.hasUtilities) {
    const utilities = utilityRecords.map(
      utility => utility.monthlyUtilityAmount,
    );
    totalArr = [...totalArr, ...utilities];
  }

  if (questions.hasRepayments) {
    const installments = installmentContractsAndOtherDebts.map(
      installment => installment.amountDueMonthly,
    );
    totalArr = [...totalArr, ...installments];
  }

  if (questions.hasOtherExpenses) {
    const other = otherExpenses.map(expense => expense.expenseAmount);
    totalArr = [...totalArr, ...other];
  }

  return totalArr.reduce((acc, expense) => acc + expense, 0);
};

export const getEmploymentHistory = ({ questions, personalData }) => {
  const { employmentHistory } = personalData;
  let history = [];

  if (questions.vetIsEmployed) {
    history = [
      ...history,
      omit('deductions', employmentHistory.veteran.currentEmployment),
    ];
  }

  if (questions.spouseIsEmployed) {
    history = [
      ...history,
      omit('deductions', employmentHistory.spouse.currentEmployment),
    ];
  }

  if (questions.vetPreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.veteran;
    const employmentRecords = previousEmployment.map(record => ({
      ...record,
      veteranOrSpouse: 'VETERAN',
    }));
    history = [...history, ...employmentRecords];
  }

  if (questions.spousePreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.spouse;
    const employmentRecords = previousEmployment.map(record => ({
      ...record,
      veteranOrSpouse: 'SPOUSE',
    }));
    history = [...history, ...employmentRecords];
  }

  return history;
};
