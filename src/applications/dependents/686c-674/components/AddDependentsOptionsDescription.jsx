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
  const isAddingDisabledChild =
    formData?.['view:addDependentOptions']?.addDisabledChild;

  let description = <></>;
  if (isAddingStudent && isAddingDisabledChild) {
    description = (
      <div>
        We’ll ask you to submit these documents at the end of this form:
        <ul>
          <li>
            Copies of medical records that document your child’s permanent
            physical or mental disability <strong>and</strong>
          </li>
          <li>
            A statement from your child’s doctor that shows the type{' '}
            <strong>and</strong> severity of the child’s permanent physical or
            mental disability
          </li>
        </ul>
        <strong>
          If you’re adding a child 18 to 23 years old who’ll be attending
          school, and
        </strong>{' '}
        if you never received benefits for this child, you must also select the
        “An unmarried child under age 18” checkbox so they can be added to the
        system. <strong>You will enter this child twice.</strong>
      </div>
    );
  } else if (isAddingStudent) {
    description = (
      <div>
        <strong>
          If you’re adding a child 18 to 23 years old who’ll be attending
          school, and
        </strong>{' '}
        if you never received benefits for this child, you must also select the
        “An unmarried child under age 18” checkbox so they can be added to the
        system. <strong>You will enter this child twice.</strong>
      </div>
    );
  } else if (isAddingDisabledChild) {
    description = (
      <div>
        We’ll ask you to submit these documents at the end of this form:
        <ul>
          <li>
            Copies of medical records that document your child’s permanent
            physical or mental disability <strong>and</strong>
          </li>
          <li>
            A statement from your child’s doctor that shows the type{' '}
            <strong>and</strong> severity of the child’s permanent physical or
            mental disability
          </li>
        </ul>
      </div>
    );
  }
  return description;
};
