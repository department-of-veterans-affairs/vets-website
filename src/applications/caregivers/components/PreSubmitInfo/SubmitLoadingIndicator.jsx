import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const hasAttemptedSubmit = submission.hasAttemptedSubmit;

  const getLoadingMessage = useCallback(
    () => {
      switch (true) {
        // leaving this case in here so it does not trigger ESLint and will be easy to add extra cases for the future
        case timer >= 0 && timer < 15:
          setLoadingMessage('Please wait while we process your application.');
          break;
        case timer >= 30:
          setLoadingMessage(
            'We’re processing your application. This may take up to 2 minutes. Please don’t refresh your browser.',
          );
          break;
        default:
          setLoadingMessage('Please wait while we process your application.');
      }
    },
    [timer],
  );

  useEffect(
    () => {
      if (hasAttemptedSubmit) {
        setLoading(true);
      }
    },
    [hasAttemptedSubmit],
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

      if (timer >= 120) {
        clearInterval(interval);
        setLoading(false);
      }

      return () => clearInterval(interval);
    },
    [timer, isLoading, getLoadingMessage],
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <AlertBox
            content="This may take 15 second up to 2 minutes please do not refresh the browser"
            headline="Long loading times may occur"
            status="warning"
          />

          <div className="vads-u-margin-y--4">
            <LoadingIndicator message={loadingMessage} />

            <p className="vads-u-text-align--center">
              {timer} seconds have passed
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
