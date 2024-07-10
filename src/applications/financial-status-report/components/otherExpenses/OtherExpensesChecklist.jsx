import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import {
  otherLivingExpensesOptions,
  otherLivingExpensesList,
} from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { isStreamlinedLongForm } from '../../utils/streamlinedDepends';
import { getMonthlyIncome } from '../../utils/calculateIncome';
import { getMonthlyExpensesAPI } from '../../utils/calculateExpenses';

const OtherExpensesChecklist = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    gmtData,
    otherExpenses = [],
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
    'view:showUpdatedExpensePages': showUpdatedExpensePages,
  } = data;

  const onChange = ({ name, checked }) => {
    setFormData({
      ...data,
      otherExpenses: checked
        ? [...otherExpenses, { name, amount: '' }]
        : otherExpenses.filter(expense => expense.name !== name),
    });
  };

  // Calculate Discretionary income as necessary
  useEffect(() => {
    const calculateExpenses = async () => {
      if (!otherExpenses?.length || !gmtData?.isEligibleForStreamlined) return;

      try {
        const response = await getMonthlyExpensesAPI(data);

        if (!response)
          throw new Error('No response from getMonthlyExpensesAPI');

        const { calculatedMonthlyExpenses } = response;

        if (!calculatedMonthlyExpenses)
          throw new Error(
            'No value destructured in response from getMonthlyExpensesAPI',
          );

        const { totalMonthlyNetIncome } = getMonthlyIncome(data);
        const calculatedDiscretionaryIncome =
          totalMonthlyNetIncome - calculatedMonthlyExpenses;

        setFormData({
          ...data,
          gmtData: {
            ...gmtData,
            discretionaryBelow:
              calculatedDiscretionaryIncome <
              gmtData?.discretionaryIncomeThreshold,
          },
        });
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          Sentry.captureMessage(
            `calculate_monthly_expenses failed in OtherExpensesChecklist: ${error}`,
          );
        });
      }
    };

    calculateExpenses();
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    // heading back to review if nav is true and no other expenses and not streamlined
    if (
      !otherExpenses?.length &&
      !isStreamlinedLongForm(data) &&
      reviewNavigation &&
      showReviewNavigation
    ) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const isBoxChecked = option => {
    return otherExpenses.some(expense => expense.name === option);
  };

  const title = 'Your other living expenses';
  const prompt = 'What other living expenses do you have?';
  const otherExpensesDisplay = showUpdatedExpensePages
    ? otherLivingExpensesList
    : otherLivingExpensesOptions;

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div className="vads-l-grid-container--full">
          <Checklist
            options={otherExpensesDisplay}
            onChange={onChange}
            title={title}
            prompt={prompt}
            isBoxChecked={isBoxChecked}
          />
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={goForward}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
      </fieldset>
    </form>
  );
};

OtherExpensesChecklist.propTypes = {
  data: PropTypes.shape({
    otherExpenses: PropTypes.array,
    gmtData: PropTypes.shape({
      isEligibleForStreamlined: PropTypes.bool,
      discretionaryIncomeThreshold: PropTypes.number,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
    'view:showUpdatedExpensePages': PropTypes.bool,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default OtherExpensesChecklist;
