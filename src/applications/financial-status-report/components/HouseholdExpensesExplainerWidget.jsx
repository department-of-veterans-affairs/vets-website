import React from 'react';
import { connect } from 'react-redux';

const HouseholdExpensesExplainerWidget = () => {
  return (
    <div className="vads-u-margin-top--neg5 vads-u-margin-bottom--neg2">
      <h2 className="vads-u-font-size--h3">Your monthly household expenses</h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Now we’re going to ask you about your monthly household expenses,
        including:
      </p>
      <ul>
        <li>Housing expenses</li>
        <li>Utility bills</li>
        <li>Installment contracts and other debts</li>
        <li>
          Other living expenses like food, clothing, transportation, child care,
          and health care costs
        </li>
      </ul>
      <va-alert status="info">
        <strong>It’s important for you to include all of your expenses.</strong>
        <p className="vads-u-font-size--base">
          This helps us understand your situation. We review your income and
          expenses when we assess your ability to repay the debt.
        </p>
      </va-alert>
    </div>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

export default connect(mapStateToProps)(HouseholdExpensesExplainerWidget);
