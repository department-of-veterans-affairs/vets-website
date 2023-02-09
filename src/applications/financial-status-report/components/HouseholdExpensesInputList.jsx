import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from './utils/InputList';

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

  return (
    <InputList
      errorList={errorList}
      inputs={expenseRecords}
      submitted={submitted}
      onChange={event => onChange(event)}
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
