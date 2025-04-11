import React from 'react';
import PropTypes from 'prop-types';
import { MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL } from 'applications/_mock-form-ae-design-patterns/utils/constants';

export const TaskComplete = ({ redirect }) => {
  // when the page loads, just go to the root url to reset the form app
  React.useEffect(() => {
    window.location.href = redirect || MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL;
  }, [redirect]);

  return <div>Your task is complete. Please wait to be redirected...</div>;
};

TaskComplete.propTypes = {
  redirect: PropTypes.string,
};
