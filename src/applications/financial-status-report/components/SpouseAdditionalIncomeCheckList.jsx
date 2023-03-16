import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherIncome } from '../constants/checkboxSelections';
import Checklist from './shared/CheckList';

const SpouseAdditionalIncomeCheckList = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { additionalIncome } = formData ?? {};
  const { spAddlIncome = [] } = additionalIncome?.spouse ?? {};

  const onChange = ({ target }) => {
    const { value } = target;
    return spAddlIncome.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            additionalIncome: {
              spouse: {
                spAddlIncome: spAddlIncome.filter(
                  source => source.name !== value,
                ),
              },
            },
          }),
        )
      : dispatch(
          setData({
            ...formData,
            additionalIncome: {
              ...additionalIncome,
              spouse: {
                ...additionalIncome.spouse,
                spAddlIncome: [...spAddlIncome, { name: value, amount: '' }],
              },
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return spAddlIncome.some(incomeValue => incomeValue.name === option);
  };

  return (
    <Checklist
      options={otherIncome}
      onChange={event => onChange(event)}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default SpouseAdditionalIncomeCheckList;
