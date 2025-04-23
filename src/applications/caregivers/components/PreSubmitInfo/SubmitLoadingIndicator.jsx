import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const SubmitLoadingIndicator = ({ submission }) => {
  const { hasAttemptedSubmit, status } = submission;
  const isLoading = hasAttemptedSubmit && status === 'submitPending';
  return isLoading ? (
    <div className="loading-container">
      <div className="vads-u-margin-y--4">
        <va-loading-indicator message={content['form-submission-message']} />
      </div>
    </div>
  ) : null;
};

SubmitLoadingIndicator.propTypes = {
  submission: PropTypes.shape({
    hasAttemptedSubmit: PropTypes.bool,
    status: PropTypes.string,
  }),
};

export default SubmitLoadingIndicator;
