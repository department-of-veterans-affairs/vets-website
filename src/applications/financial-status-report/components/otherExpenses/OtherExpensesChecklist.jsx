import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherLivingExpensesOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateDiscressionaryIncome } from '../../utils/streamlinedDepends';

const OtherExpensesChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { gmtData, otherExpenses = [] } = formData;

  useEffect(() => {
    if (!gmtData?.isElidgibleForStreamlined) return;

    const calculatedDiscressionaryIncome = calculateDiscressionaryIncome(
      formData,
    );
    dispatch(
      setData({
        ...formData,
        gmtData: {
          ...gmtData,
          discressionaryBelow:
            calculatedDiscressionaryIncome <
            gmtData?.discressionaryIncomeThreshold,
        },
      }),
    );
  }, []);

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

  const title = 'Your other living expenses';
  const prompt = 'What other living expenses do you have?';

  return (
    <Checklist
      options={otherLivingExpensesOptions}
      onChange={onChange}
      title={title}
      prompt={prompt}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default OtherExpensesChecklist;
