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
      <h4>Total number of maximum eligible students reported:</h4>
      {!allUnlimited &&
        !hasUnlimited && (
          <p>
            You reported a maximum of {maxContributions} eligible students for
            participation.
          </p>
        )}

      {!allUnlimited &&
        hasUnlimited && (
          <>
            <p>
              You reported a maximum of {maxContributions} eligible students for
              participation, and
            </p>
            <p>
              You have selected unlimited for the maximum number of eligible
              students.
            </p>
          </>
        )}

      {allUnlimited && (
        <p>
          You have selected unlimited for the maximum number of eligible
          students.
        </p>
      )}
    </div>
  );
};

export default AddEligibileStudents;
