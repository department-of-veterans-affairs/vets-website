import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherIncome } from '../../constants/checkboxSelections';

import Checklist from '../shared/CheckList';
import { calculateTotalIncome } from '../../utils/streamlinedDepends';

const SpouseAdditionalIncomeCheckList = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { gmtData, additionalIncome } = formData ?? {};
  const { spAddlIncome = [] } = additionalIncome?.spouse ?? {};

  // useEffect to set incomeBelowGMT on mount
  useEffect(() => {
    if (!gmtData?.isElidgibleForStreamlined) return;

    const calculatedIncome = calculateTotalIncome(formData);
    dispatch(
      setData({
        ...formData,
        gmtData: {
          ...gmtData,
          incomeBelowGMT: calculatedIncome < gmtData?.gmtThreshold,
          incomeBelowOneFiftyGMT:
            calculatedIncome < gmtData?.incomeUpperThreshold,
        },
      }),
    );
  }, []);

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
  const title = 'Your spouse’s other income';
  const prompt = 'Select any additional income your spouse receives:';

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

export default SpouseAdditionalIncomeCheckList;
