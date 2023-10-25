import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ message, testId }) => (
  <div className="vads-u-padding-bottom--4">
    <h1 className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3">
      Personal health care contacts
    </h1>
    <div className="vads-u-margin-y--6">
      <va-loading-indicator data-testid={testId} message={message} />
    </div>
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
