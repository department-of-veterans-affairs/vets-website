import React from 'react';
// import { useSelector } from 'react-redux';
import { alert } from '../helpers';

export const ConflictOfInterestIntro = () => {
  // const formData = useSelector(state => state.form.data);
  const conflictingIndividuals = 0;
  // const conflictingIndividuals = 1
  // const conflictingIndividuals = formData?.conflictingIndividuals.length // find property, fix naming to refernce length

  return !conflictingIndividuals ? (
    <>
      <div data-testid="instructions">
        <p>
          Title 38 U.S.C. 3638 prohibits employees of the Department of Veterans
          Affairs (VA) and the State Approving Agency (SAA) from owning any
          interest in a for-profit educational institution. These employees
          cannot receive wages, salary, dividends, profits, or gifts from
          for-profit schools. The law also prohibits VA employees from receiving
          any services from these schools. The VA may waive these restrictions
          if it determines that no harm will result to the government, Veterans,
          or eligible persons.
        </p>
        <p>
          In the next step, you’ll provide information about any VA or SAA
          employees who may have a conflict under this law.
        </p>
      </div>
      {alert}
    </>
  ) : null;
};
