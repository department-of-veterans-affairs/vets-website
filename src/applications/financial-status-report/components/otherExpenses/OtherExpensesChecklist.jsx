import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherLivingExpensesOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const OtherExpensesChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { otherExpenses = [] } = formData;

  const onChange = ({ target }) => {
    const { value } = target;
    return otherExpenses.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            otherExpenses: otherExpenses.filter(
              source => source.name !== value,
            ),
          }),
        )
      : dispatch(
          setData({
            ...formData,
            otherExpenses: [...otherExpenses, { name: value, amount: '' }],
          }),
        );
  };

  const isBoxChecked = option => {
    return otherExpenses.some(expense => expense.name === option);
  };

  return (
    <Checklist
      options={otherLivingExpensesOptions}
      onChange={onChange}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default OtherExpensesChecklist;
