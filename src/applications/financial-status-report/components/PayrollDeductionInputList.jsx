import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

const PayrollDeductionInputList = ({ errorSchema }) => {
  const errorList = errorSchema?.payrollDeductionRecords?.__errors;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    additionalIncome: { payrollDeductionRecords },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        additionalIncome: {
          ...data.additionalIncome,
          payrollDeductionRecords: payrollDeductionRecords.map(income => {
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
      <legend className="schemaform-block-title">
        Your job at EMPLOYER.NAME
      </legend>
      <p>How much do you pay for each of your payroll deductions?</p>
      {payrollDeductionRecords?.map((income, key) => (
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

export default PayrollDeductionInputList;
