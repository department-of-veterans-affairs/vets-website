import React from 'react';
import PropTypes from 'prop-types';

import { MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL } from '../utils/constants';

export const TaskComplete = () => {
  // when the page loads, just go to the root url to reset the form app
  React.useEffect(() => {
    window.location.href = MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL;
  }, []);

  return <div>TaskComplete</div>;
};

TaskComplete.propTypes = {
  rootUrl: PropTypes.string,
};
