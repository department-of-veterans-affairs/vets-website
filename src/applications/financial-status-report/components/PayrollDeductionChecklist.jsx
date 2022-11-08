import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { payrollDeductionOptions } from '../constants/checkboxSelections';

const PayrollDeductionChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { currEmployment = [] } = formData;
  const selectedEmployment = currEmployment[0];
  const { deductions = [] } = selectedEmployment ?? [];

  const onChange = ({ target }) => {
    const { value } = target;

    return deductions.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            currEmployment: [
              {
                ...selectedEmployment,
                deductions: deductions.filter(source => source.name !== value),
              },
              ...currEmployment.filter(
                job => job.employerName !== selectedEmployment.employerName,
              ),
            ],
          }),
        )
      : dispatch(
          setData({
            ...formData,
            currEmployment: [
              {
                ...selectedEmployment,
                deductions: [...deductions, { name: value, amount: '' }],
              },
              ...currEmployment.filter(
                job => job.employerName !== selectedEmployment.employerName,
              ),
            ],
          }),
        );
  };

  const isBoxChecked = option => {
    return deductions.some(incomeValue => incomeValue.name === option);
  };

  return (
    <div className="checkbox-list">
      {payrollDeductionOptions?.map((option, key) => (
        <div key={option + key} className="checkbox-list-item">
          <input
            type="checkbox"
            id={option + key}
            name={option}
            value={option}
            checked={isBoxChecked(option)}
            onChange={onChange}
          />
          <label className="vads-u-margin-y--2" htmlFor={option + key}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PayrollDeductionChecklist;
