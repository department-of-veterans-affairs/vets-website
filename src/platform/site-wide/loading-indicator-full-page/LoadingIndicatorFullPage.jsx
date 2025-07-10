import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingIndicatorFullPage({
  message = 'Loading your information...',
}) {
  return (
    <div className="loading-indicator-full-page-container">
      <va-loading-indicator set-focus message={message} />
    </div>
  );
}

LoadingIndicatorFullPage.propTypes = {
  message: PropTypes.string,
};
