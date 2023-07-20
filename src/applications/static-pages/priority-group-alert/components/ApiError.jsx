import React from 'react';
import PropTypes from 'prop-types';

const ApiError = ({ content, headline }) => (
  <va-alert close-btn-aria-label="Close notification" status="warning" visible>
    <h2 slot="headline">{headline}</h2>
    <div className="vads-u-margin-y--0">
      <p className="vads-u-margin-bottom--0">{content}</p>
    </div>
  </va-alert>
);

ApiError.propTypes = {
  content: PropTypes.string,
  headline: PropTypes.string,
};

ApiError.defaultProps = {
  content:
    'Something went wrong on our end. Please refresh or try again later.',
  headline: "We can't access your priority group information",
};

export default ApiError;
