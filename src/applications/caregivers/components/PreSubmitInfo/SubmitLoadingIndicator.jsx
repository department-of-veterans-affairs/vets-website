import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    'Please wait while we process your application.',
  );
  const hasAttemptedSubmit = submission.hasAttemptedSubmit;
  const isSubmitPending = submission.status === 'submitPending';

  // set loading to true if user has attempted to submit and submit is pending
  useEffect(
    () => {
      if (hasAttemptedSubmit && isSubmitPending) {
        setLoading(true);
      }
    },
    [hasAttemptedSubmit, isSubmitPending],
  );

  // after 15 seconds set the longWaitMessage in spinner
  useEffect(
    () => {
      const longWaitMessage =
        'We’re processing your application. This may take up to 1 minute. Please don’t refresh your browser.';

      if (timer >= 15) {
        setLoadingMessage(longWaitMessage);
      }
    },
    [timer],
  );

  // count the seconds so we know how long the user has waited
  useEffect(
    () => {
      let interval = null;

      if (isLoading) {
        interval = setInterval(() => {
          setTimer(seconds => seconds + 1);
        }, 1000);
      }

      return () => {
        clearInterval(interval);
      };
    },
    [timer, isLoading],
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <div className="vads-u-margin-y--4">
            <LoadingIndicator message={loadingMessage} />
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
