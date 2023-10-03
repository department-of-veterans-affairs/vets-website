import React from 'react';

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

export default Loading;
