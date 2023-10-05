import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ message, testId }) => {
  return (
    <div className="vads-u-margin--5">
      <va-loading-indicator data-testid={testId} message={message} />
    </div>
  );
};

Loading.defaultProps = {
  message: 'Please wait...',
  testId: 'nok-ec-loading',
};

Loading.propTypes = {
  message: PropTypes.string,
  testId: PropTypes.string,
};

export default Loading;
