import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';
import environment from 'platform/utilities/environment';
import formConfig from '../config/form';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  let ariaDescribedBy = null;
  if (formConfig?.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig?.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }

  const activeDutyNote = (
    <div
      className="vads-u-margin-bottom--3"
      id={!environment.isProduction() && ariaDescribedBy}
    >
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
