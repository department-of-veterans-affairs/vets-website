import React from 'react';

const SubmissionError = ({ user, saveLink }) => {
  return (
    <div
      className="usa-alert usa-alert-error schemaform-failure-alert"
      // data-testid={testId}
    >
      <div className="usa-alert-body">
        {user.login.currentlyLoggedIn && (
          <>
            <p className="schemaform-warning-header">
              <h3>Please save this application and try again</h3>
            </p>
            <p>
              We’re sorry. Something went wrong on our end. It looks like your
              application didn’t go through. We’re working to fix the problem,
              but it may take us a while. Please save your application and try
              again later.
            </p>
            {saveLink}.<br />
          </>
        )}
        {!user.login.currentlyLoggedIn && (
          <>
            <p className="schemaform-warning-header">
              <h3>We’ve run into a problem</h3>
            </p>
            <p>
              We’re sorry. Something went wrong on our end. It looks like your
              application didn’t go through and you’ll need to start over. We’re
              working to fix the problem, but it may take us a while.
            </p>
          </>
        )}
        <h4>What you can do</h4>
        <p>
          If you’re unable to submit or save your application online, you can
          mail or fax your application for Pre-Need Eligibility Determination
          (VA Form 40-10007).
        </p>
        <p>
          <a href="https://www.va.gov/vaforms/va/pdf/va40-10007.pdf">
            Find a VA national cemetery
          </a>
        </p>
        <p>
          Please mail it to the NCA Intake Center, P.O. Box 5237, Janesville, WI
          53547 or fax it to the National Cemetery Scheduling Office:
          <va-telephone contact="8558408299" />.
        </p>
      </div>
    </div>
  );
};

export default SubmissionError;
