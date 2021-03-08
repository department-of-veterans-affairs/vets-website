import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const hasAttemptedSubmit = submission.hasAttemptedSubmit;
  const isSubmitPending = submission.status === 'submitPending';

  const getLoadingMessage = useCallback(
    () => {
      if (timer >= 0) {
        setLoadingMessage('Please wait while we process your application.');
      }

      if (timer >= 15) {
        setLoadingMessage(
          'We’re processing your application. This may take up to 1 minute. Please don’t refresh your browser.',
        );
      }
    },
    [timer],
  );

  useEffect(
    () => {
      if (hasAttemptedSubmit && isSubmitPending) {
        setLoading(true);
      }
    },
    [hasAttemptedSubmit, isSubmitPending],
  );

  useEffect(
    () => {
      let interval = null;

      if (isLoading) {
        interval = setInterval(() => {
          setTimer(seconds => seconds + 1);
        }, 1000);

        getLoadingMessage();
      }

      return () => {
        clearInterval(interval);
      };
    },
    [timer, isLoading, getLoadingMessage],
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <div className="vads-u-margin-y--4">
            <LoadingIndicator message={() => <p>{loadingMessage}</p>} />
            <p>{loadingMessage}</p>
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
