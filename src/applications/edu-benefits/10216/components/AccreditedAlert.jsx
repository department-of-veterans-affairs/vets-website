import React from 'react';

const AccreditedAlert = () => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <>
        <p className="vads-u-margin-y--0" id="additional-form-needed-alert">
          This form requires additional step for successful submission. Follow
          the instructions below carefully to ensure your form is submitted
          correctly.
        </p>
      </>
    </va-alert>
  );
};

export default AccreditedAlert;
