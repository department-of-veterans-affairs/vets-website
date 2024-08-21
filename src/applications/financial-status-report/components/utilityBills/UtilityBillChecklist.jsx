import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { utilityBillOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const UtilityBillChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { utilityRecords = [] } = formData;

  const onChange = ({ name, checked }) => {
    dispatch(
      setData({
        ...formData,
        utilityRecords: checked
          ? [...utilityRecords, { name, amount: '' }]
          : utilityRecords.filter(utility => utility.name !== name),
      }),
    );
  };

  const isBoxChecked = option => {
    return utilityRecords.some(utility => utility.name === option);
  };

  const title = 'Your monthly utility bills';
  const prompt = 'Which of the following utilities do you pay for?';

  return (
    <Checklist
      title={title}
      prompt={prompt}
      options={utilityBillOptions}
      onChange={onChange}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default UtilityBillChecklist;
