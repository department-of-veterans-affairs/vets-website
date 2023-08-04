import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherLivingExpensesOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateDiscressionaryIncome } from '../../utils/streamlinedDepends';

const OtherExpensesChecklist = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { gmtData, otherExpenses = [] } = data;

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

  // Calculate discressionary income as necessary
  const updateStreamlinedValues = () => {
    if (otherExpenses?.length || !gmtData?.isElidgibleForStreamlined) return;

    const calculatedDiscressionaryIncome = calculateDiscressionaryIncome(data);
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        discressionaryBelow:
          calculatedDiscressionaryIncome <
          gmtData?.discressionaryIncomeThreshold,
      },
    });
  };

  const isBoxChecked = option => {
    return otherExpenses.some(expense => expense.name === option);
  };

  const title = 'Your other living expenses';
  const prompt = 'What other living expenses do you have?';

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
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
      isElidgibleForStreamlined: PropTypes.bool,
      discressionaryIncomeThreshold: PropTypes.number,
    }),
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default OtherExpensesChecklist;
