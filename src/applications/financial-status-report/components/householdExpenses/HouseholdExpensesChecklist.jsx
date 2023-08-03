import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { householdExpensesOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

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
  const title = 'Monthly housing expenses';
  const prompt = 'Which of these expenses do you pay for?';

  return (
    <Checklist
      title={title}
      prompt={prompt}
      options={householdExpensesOptions}
      onChange={event => onChange(event)}
      isBoxChecked={isBoxChecked}
      required
    />
  );
};

export default HouseholdExpensesChecklist;
