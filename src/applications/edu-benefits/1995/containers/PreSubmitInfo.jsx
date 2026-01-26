import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';
import { eighteenOrOverUpdate } from '../helpers';

export function isActiveDuty(formData) {
  return formData?.isActiveDuty;
}

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
          {!eighteenOrOverUpdate(formData.dateOfBirth) && (
            <li>You are the parent, guardian, or custodian of the applicant</li>
          )}
          <li>
            All statements in this application are true and correct to the best
            of your knowledge and belief
          </li>
          {isActiveDuty(formData) && (
            <li>
              As an active-duty service member, you have consulted with an
              Education Service Officer (ESO) regarding your education program
            </li>
          )}
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
