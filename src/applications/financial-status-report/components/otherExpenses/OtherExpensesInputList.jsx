import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const OtherExpensesInputList = props => {
  const { errorSchema, formContext } = props;
  const errorList = errorSchema?.otherExpenses?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const { otherExpenses = [] } = data;

  const onChange = ({ target }) => {
    const newExpenses = otherExpenses.map(expense => {
      if (expense.name === target.name) {
        return {
          ...expense,
          amount: target.value,
        };
      }
      return expense;
    });

    return dispatch(
      setData({
        ...data,
        otherExpenses: newExpenses,
      }),
    );
  };

  const title = 'Your added living expenses';
  const prompt = 'How much do you pay for each living expense every month?';

  return (
    <InputList
      errorList={errorList}
      inputs={otherExpenses}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.OTHER_EXPENSE_MIN}
      max={VALIDATION_LIMITS.OTHER_EXPENSE_MAX}
    />
  );
};

OtherExpensesInputList.propTypes = {
  errorSchema: PropTypes.shape({
    otherExpenses: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default OtherExpensesInputList;
