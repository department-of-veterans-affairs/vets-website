import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';
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

  return (
    <>
      <div id={ariaDescribedBy} className="vads-u-margin-bottom--3">
        <strong>By submitting this form</strong> you certify that all statements
        in this application are true and correct to the best of your knowledge
        and belief.
      </div>
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
