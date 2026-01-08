import React from 'react';

const ApplicationDiscontinuedAlert = () => {
  return (
    <div className="usa-width-two-thirds vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">Sorry, your application has been discontinued</h3>
        <p className="vads-u-margin-y--0">
          Please contact the Central Office. You can find a copy of the letter
          down below.
        </p>
      </va-alert>
    </div>
  );
};

export default ApplicationDiscontinuedAlert;
