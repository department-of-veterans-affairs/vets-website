import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherIncome } from '../constants/checkboxSelections';
import Checklist from './shared/CheckList';

const AdditionalIncomeCheckList = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { additionalIncome } = formData;
  const { addlIncRecords = [] } = additionalIncome;

  const onChange = ({ target }) => {
    const { value } = target;
    return addlIncRecords.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            additionalIncome: {
              ...additionalIncome,
              addlIncRecords: addlIncRecords.filter(
                source => source.name !== value,
              ),
            },
          }),
        )
      : dispatch(
          setData({
            ...formData,
            additionalIncome: {
              ...additionalIncome,
              addlIncRecords: [...addlIncRecords, { name: value, amount: '' }],
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return addlIncRecords.some(incomeValue => incomeValue.name === option);
  };

  const title = 'Your other income';
  const prompt = 'Select any additional income you receive:';

  return (
    <Checklist
      title={title}
      prompt={prompt}
      options={otherIncome}
      onChange={event => onChange(event)}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default AdditionalIncomeCheckList;
