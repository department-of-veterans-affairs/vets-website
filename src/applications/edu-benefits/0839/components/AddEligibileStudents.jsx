import React from 'react';
import { useSelector } from 'react-redux';
import { addMaxContributions } from '../helpers';

const AddEligibileStudents = () => {
  const formData = useSelector(state => state.form.data);
  const maxContributions = addMaxContributions(
    formData?.yellowRibbonProgramRequest || [],
  );
  const hasUnlimited = formData?.yellowRibbonProgramRequest?.some(
    item => item?.maximumStudentsOption === 'unlimited',
  );
  const allUnlimited = formData?.yellowRibbonProgramRequest?.every(
    item => item?.maximumStudentsOption === 'unlimited',
  );
  return (
    <div className="eligible-students-container">
      <h4>
        Total number of maximum eligible students reported:{' '}
        {!allUnlimited ? maxContributions : 'Unlimited'}
        {hasUnlimited && !allUnlimited ? ' or unlimited' : ''}
      </h4>
    </div>
  );
};

export default AddEligibileStudents;
