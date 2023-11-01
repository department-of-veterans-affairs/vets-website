import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

export function isActiveDuty(/* formData */) {
  return false;
  /*
  try {
    // VFEP-875 will go here
  } catch (e) {
    return false;
  } */
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
          {/* always show below <li> */}
          <li>
            All statements in this application are true and correct to the best
            of your knowledge and belief
          </li>
          {
            // isActiveDuty(/* formData */) && (
            /*  <li>
              As an active-duty service member, you have consulted with an
              Education Service Officer (ESO) regarding your education program
            </li>
          ) */
          }
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
