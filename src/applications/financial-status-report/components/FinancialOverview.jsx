import React from 'react';
import { connect } from 'react-redux';

const getMonthlyIncome = ({
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

const getMonthlyExpenses = ({
  questions,
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContractsAndOtherDebts,
}) => {
  let totalArr = [];

  const householdExpenses = Object.values(expenses);
  totalArr = [...totalArr, ...householdExpenses];

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

const FinancialOverview = ({ formData }) => {
  const { selectedDebts } = formData;
  const monthlyIncome = getMonthlyIncome(formData);
  const monthlyExpenses = getMonthlyExpenses(formData);
  const totalIncome = monthlyIncome - monthlyExpenses;
  const index = window.location.href.slice(-1);
  const debt = selectedDebts[index];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <>
      <h4>Your financial overview</h4>
      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--5">
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly income:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(monthlyIncome))}
          </div>
        </div>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly taxes and expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(monthlyExpenses))}
          </div>
        </div>
        <div className="vads-u-margin-bottom--0 overview-container">
          <div>Income after taxes and expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(totalIncome))}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(FinancialOverview);
