import React, { Fragment } from 'react';

const ErrorEnrollmentStatement = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">Attention</h2>
      <Fragment key=".1">
        <p className="vads-u-margin-y--0">
          You indicated that there may be errors with the below enrollment
          information. If that is correct, please submit the form and work with
          your School Certifying Official (SCO) before resubmitting your
          enrollment verification.
        </p>
      </Fragment>
    </va-alert>
  );
};

export default ErrorEnrollmentStatement;
