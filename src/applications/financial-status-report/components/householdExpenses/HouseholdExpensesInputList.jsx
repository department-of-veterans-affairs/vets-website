import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const HouseholdExpensesInputList = props => {
  const { submitted } = props.formContext;
  const { errorSchema } = props;

  const errorList = errorSchema?.expenseRecords?.__errors;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    expenses: { expenseRecords },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        expenses: {
          ...data.expenses,
          expenseRecords: expenseRecords.map(income => {
            if (income.name === target.name) {
              return {
                ...income,
                amount: target.value,
              };
            }
            return income;
          }),
        },
      }),
    );
  };
  const title = 'Monthly housing expenses';
  const prompt = 'How much do you pay for each housing expense every month?';

  return (
    <InputList
      errorList={errorList}
      inputs={expenseRecords}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.HOUSEHOLD_EXPENSES_MIN}
      max={VALIDATION_LIMITS.HOUSEHOLD_EXPENSES_MAX}
    />
  );
};

HouseholdExpensesInputList.propTypes = {
  errorSchema: PropTypes.shape({
    expenseRecords: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default HouseholdExpensesInputList;
