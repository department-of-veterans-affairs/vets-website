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
      {formData.activeDuty ? (
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
          <strong>By submitting this form</strong> you certify that all
          statements in this application are true and correct to the best of
          your knowledge and belief.
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* prod flag for 23443 */}
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
