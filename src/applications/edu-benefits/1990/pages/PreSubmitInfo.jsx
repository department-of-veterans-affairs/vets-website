import React from 'react';
import environment from 'platform/utilities/environment';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const activeDutyNote = () => {
    if (
      formData.currentlyActiveDuty.yes === true &&
      !environment.isProduction()
    ) {
      return (
        <div>
          <p>
            <strong>By submitting this form</strong> you certify that:
          </p>
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
      );
    }

    return (
      <div>
        <p>
          <strong>By submitting this form</strong> you certify that:
        </p>
        <ul>
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
