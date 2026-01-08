import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Conditionally show adding student description
 * @returns {React.ReactElement} Description for adding dependents options
 */
export const AddDependentsOptionsDescription = () => {
  const formData = useSelector(state => {
    return state?.form?.data || {};
  });

  const isAddingStudent = formData?.['view:addDependentOptions']?.report674;

  let description = <></>;
  if (isAddingStudent) {
    description = (
      <div>
        <strong>
          If you’re adding a child 18 to 23 years old who’ll be attending
          school, and
        </strong>{' '}
        if you never received benefits for this child, you must also select the
        “Add a child or children under 18 and unmarried” checkbox so they can be
        added to the system. <strong>You will enter this child twice.</strong>
      </div>
    );
  }
  return description;
};
