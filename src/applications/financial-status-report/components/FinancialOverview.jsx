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

  if (questions.hasAdditionalIncome) {
    const vetAddl = additionalIncome.additionalIncomeRecords.map(
      record => record.monthlyIncome,
    );
    totalArr = [...totalArr, ...vetAddl];
  }

  if (questions.spouseIsEmployed) {
    const { grossMonthlyIncome } = employmentHistory.spouse.currentEmployment;
    totalArr = [...totalArr, grossMonthlyIncome];
  }

  if (questions.spouseHasAdditionalIncome) {
    const spouseAddl = additionalIncome.spouse.additionalIncomeRecords.map(
      record => record.monthlyIncome,
    );
    totalArr = [...totalArr, ...spouseAddl];
  }

  if (questions.spouseHasBenefits) {
    const { benefitAmount, educationAmount } = benefits.spouseBenefits;
    totalArr = [...totalArr, benefitAmount, educationAmount];
  }

  if (questions.hasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  if (questions.spouseHasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity.spouse;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  return totalArr.reduce((acc, income) => acc + income, 0);
};

const FinancialOverview = ({ formData }) => {
  const { selectedDebts } = formData;

  const monthlyIncome = getMonthlyIncome(formData);

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
          <div>Total monthly expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
          </div>
        </div>
        <div className="vads-u-margin-bottom--0 overview-container">
          <div>Income after taxes and expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
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
