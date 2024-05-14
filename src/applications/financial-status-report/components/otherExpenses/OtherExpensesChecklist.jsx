import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherLivingExpensesOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import {
  calculateDiscretionaryIncome,
  isStreamlinedLongForm,
} from '../../utils/streamlinedDepends';

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
  } = data;

  const onChange = ({ target }) => {
    const { value } = target;

    return otherExpenses.some(source => source.name === value)
      ? setFormData({
          ...data,
          otherExpenses: otherExpenses.filter(source => source.name !== value),
        })
      : setFormData({
          ...data,
          otherExpenses: [...otherExpenses, { name: value, amount: '' }],
        });
  };

  // Calculate Discretionary income as necessary
  const updateStreamlinedValues = () => {
    if (otherExpenses?.length || !gmtData?.isEligibleForStreamlined) return;

    const calculatedDiscretionaryIncome = calculateDiscretionaryIncome(data);
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        discretionaryBelow:
          calculatedDiscretionaryIncome < gmtData?.discretionaryIncomeThreshold,
      },
    });
  };

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

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div className="vads-l-grid-container--full">
          <Checklist
            options={otherLivingExpensesOptions}
            onChange={onChange}
            title={title}
            prompt={prompt}
            isBoxChecked={isBoxChecked}
          />
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={updateStreamlinedValues}
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
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default OtherExpensesChecklist;
