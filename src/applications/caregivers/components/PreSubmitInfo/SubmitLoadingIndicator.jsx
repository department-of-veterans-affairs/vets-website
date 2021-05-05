import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);

  const hasAttemptedSubmit = submission.hasAttemptedSubmit;
  const isSubmitPending = submission.status === 'submitPending';

  // set loading to true if user has attempted to submit and submit is pending
  useEffect(
    () => {
      if (hasAttemptedSubmit && isSubmitPending) {
        setLoading(true);
      }

      return () => {
        setLoading(false);
      };
    },
    [hasAttemptedSubmit, isSubmitPending],
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <div className="vads-u-margin-y--4">
            <LoadingIndicator />
            <p>
              We’re processing your application. This may take up to 1 minute.
              Please don’t refresh your browser.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  submission: state.form.submission,
});

export default connect(mapStateToProps)(SubmitLoadingIndicator);
