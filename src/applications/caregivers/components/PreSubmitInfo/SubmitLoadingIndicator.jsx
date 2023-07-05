import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const SubmitLoadingIndicator = ({ submission }) => {
  const [isLoading, setLoading] = useState(false);

  const { hasAttemptedSubmit, status } = submission;
  const isSubmitPending = status === 'submitPending';

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
            <va-loading-indicator message="We’re processing your application. This may take up to 1 minute. Please don’t refresh your browser." />
          </div>
        </div>
      )}
    </>
  );
};

SubmitLoadingIndicator.propTypes = {
  submission: PropTypes.object.isRequired,
};

export default SubmitLoadingIndicator;
