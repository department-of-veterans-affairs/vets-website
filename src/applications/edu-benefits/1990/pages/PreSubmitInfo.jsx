import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

import { eighteenOrOver, SeventeenOrOlder } from '../helpers';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const activeDutyNote = () => {
    return (
      <div>
        <p>
          <strong>By submitting this form</strong> you certify that:
        </p>
        <ul>
          {/* if applicant is 17 years old, show below <li> */
          !eighteenOrOver(formData.veteranDateOfBirth) &&
            SeventeenOrOlder(formData.veteranDateOfBirth) && (
              <li>
                You are the parent, guardian, or custodian of the applicant
              </li>
            )}
          {/* if applicant is on active duty, show below <li> */
          formData.currentlyActiveDuty.yes === true && (
            <li>
              As an active-duty service member, you have consulted with an
              Education Service Officer (ESO) regarding your education program
            </li>
          )}
          {/* always show below <li> */}
          <li>
            All statements in this application are true and correct to the best
            of your knowledge and belief
          </li>
        </ul>
      </div>
    );
  };
  return (
    <>
      {activeDutyNote()}
      <PreSubmitInfo
        formData={formData}
        showError={showError}
        onSectionComplete={onSectionComplete}
        setPreSubmit={setPreSubmit}
      />
    </>
  );
}

export default PreSubmitNotice;
