/* eslint-disable react/prop-types */
import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const activeDutyNote = (
    <div className="vads-u-margin-bottom--3">
      {formData.isActiveDuty ? (
        <div>
          <strong>By submitting this form</strong> you certify that:
          <ul>
            <li>
              All statements in this application are true and correct to the
              best of your knowledge and belief
            </li>
            <li>
              As an active-duty service member, you have consulted with an
              Education Service Officer (ESO) regarding your education program
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <p>
            <b>By submitting this form</b> you certify that all statements in
            this application are true and correct to the best of your knowledge
            and belief.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {activeDutyNote}
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
