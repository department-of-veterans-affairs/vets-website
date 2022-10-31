import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherIncome } from '../constants/checkboxSelections';

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

  return (
    <div className="checkbox-list">
      {otherIncome?.map((option, key) => (
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

export default AdditionalIncomeCheckList;
