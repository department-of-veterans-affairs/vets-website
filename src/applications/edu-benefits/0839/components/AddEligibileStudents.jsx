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
  const firstRequest = formData?.yellowRibbonProgramRequest?.[0];
  const academicYear =
    firstRequest?.academicYearDisplay || firstRequest?.academicYear;

  return (
    <va-summary-box class="eligible-students-container">
      {academicYear && (
        <>
          <h4 className="vads-u-margin-top--0">
            Academic year this agreement applies to:
          </h4>
          <p>{academicYear}</p>
        </>
      )}
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
    </va-summary-box>
  );
};

export default AddEligibileStudents;
