import React from 'react';
import PropTypes from 'prop-types';

export const TaskComplete = props => {
  // when the page loads, just go to the root url to reset the form app
  React.useEffect(() => {
    window.location.href = props.rootUrl;
  }, []);

  return <div>TaskComplete</div>;
};

TaskComplete.propTypes = {
  rootUrl: PropTypes.string,
};
