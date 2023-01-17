import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

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
    <div>
      {expenseRecords?.map((income, key) => (
        <div key={income.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={income.name}
            name={income.name}
            value={income.amount}
            id={income.name + key}
            error={
              submitted && errorList.includes(income.name)
                ? 'Enter valid dollar amount'
                : ''
            }
            inputmode="decimal"
            onInput={onChange}
            required
          />
        </div>
      ))}
    </div>
  );
};

export default HouseholdExpensesInputList;
