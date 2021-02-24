import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(null);
  // eslint-disable-next-line no-console
  console.log('submission: ', submission);
  const hasAttemptedSubmit = submission.hasAttemptedSubmit;

  const getLoadingMessage = useCallback(
    () => {
      // eslint-disable-next-line no-console
      console.log('timer: ', timer);

      switch (true) {
        case timer >= 0 && timer < 15:
          setLoadingMessage('Still loading your application... 👋🏼');
          break;
        case timer >= 15 && timer < 30:
          setLoadingMessage('Still loading your application... 👋🏼');
          break;
        case timer >= 30 && timer < 60:
          setLoadingMessage(
            'This is taking a little longer that we would like ⏲️',
          );
          break;
        case timer >= 60 && timer < 90:
          setLoadingMessage(
            'We are super close to submitting your application 🙏🏼',
          );
          break;
        case timer >= 90 && timer < 120:
          setLoadingMessage('Almost done I promise 😬');
          break;
        default:
          setLoadingMessage('Loading your application...');
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
      {isLoading ? (
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
      ) : null}
    </>
  );
};

const mapStateToProps = state => ({
  submission: state.form.submission,
});

export default connect(mapStateToProps)(SubmitLoadingIndicator);
