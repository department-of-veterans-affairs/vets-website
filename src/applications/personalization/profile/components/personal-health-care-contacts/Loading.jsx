import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ message, testId }) => (
  <div className="vads-u-margin-y--6">
    <va-loading-indicator data-testid={testId} message={message} />
  </div>
);

Loading.defaultProps = {
  message: 'Please wait...',
  testId: 'phcc-loading',
};

Loading.propTypes = {
  message: PropTypes.string,
  testId: PropTypes.string,
};

export default Loading;
