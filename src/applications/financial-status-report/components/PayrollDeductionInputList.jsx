import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

const PayrollDeductionInputList = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const { currEmployment = [] } = data;
  const selectedEmployment = currEmployment[0];
  const { deductions = [] } = selectedEmployment;

  const mapDeductions = target => {
    return deductions.map(deduction => {
      if (deduction.name === target.name) {
        return {
          ...deduction,
          amount: target.value,
        };
      }
      return deduction;
    });
  };

  const onChange = obj => {
    const { target } = obj;

    return dispatch(
      setData({
        ...data,
        currEmployment: [
          {
            ...selectedEmployment,
            deductions: mapDeductions(target),
            ...currEmployment.filter(
              job => job.employerName !== selectedEmployment.employerName,
            ),
          },
        ],
      }),
    );
  };

  return (
    <div>
      <p>How much do you pay for each of your payroll deductions?</p>
      {deductions?.map((income, key) => (
        <div key={income.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={income.name}
            name={income.name}
            value={income.amount}
            id={income.name + key}
            inputmode="decimal"
            error="Hello"
            onInput={onChange}
            required
          />
        </div>
      ))}
    </div>
  );
};

export default PayrollDeductionInputList;
