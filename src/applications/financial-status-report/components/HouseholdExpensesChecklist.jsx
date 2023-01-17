import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { householdExpensesOptions } from '../constants/checkboxSelections';

const HouseholdExpensesChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { expenses } = formData;
  const { expenseRecords = [] } = expenses;

  const onChange = ({ target }) => {
    const { value } = target;
    return expenseRecords.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            expenses: {
              ...expenses,
              expenseRecords: expenseRecords.filter(
                source => source.name !== value,
              ),
            },
          }),
        )
      : dispatch(
          setData({
            ...formData,
            expenses: {
              ...expenses,
              expenseRecords: [...expenseRecords, { name: value, amount: '' }],
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return expenseRecords.some(incomeValue => incomeValue.name === option);
  };

  return (
    <div className="checkbox-list">
      {householdExpensesOptions?.map((option, key) => (
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

export default HouseholdExpensesChecklist;
