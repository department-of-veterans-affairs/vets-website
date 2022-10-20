import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

const MonetaryInputList = ({ errorSchema }) => {
  const errorList = errorSchema?.addlIncRecords?.__errors;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    additionalIncome: { addlIncRecords },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        additionalIncome: {
          ...data.additionalIncome,
          addlIncRecords: addlIncRecords.map(income => {
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
      <legend className="schemaform-block-title">Your other income</legend>
      <p>How much is your monthly income for each income source?</p>
      {addlIncRecords?.map((income, key) => (
        <div key={income.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={income.name}
            name={income.name}
            value={income.amount}
            id={income.name + key}
            error={
              errorList.includes(income.name) ? 'Enter valid dollar amount' : ''
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

export default MonetaryInputList;
