import PropTypes from 'prop-types';
import React from 'react';
import FindCCFacilityLink from './FindCCFacilityLink';

const ErrorAlert = ({ body, showFindCCFacilityLink = false }) => {
  return (
    <va-alert data-testid="error" status="error">
      <h2>We’re sorry. We’ve run into a problem.</h2>
      <p data-testid="error-body">
        {body || 'Something went wrong on our end. Please try again later.'}
      </p>
      {showFindCCFacilityLink && <FindCCFacilityLink />}
    </va-alert>
  );
};

export default ErrorAlert;

ErrorAlert.propTypes = {
  body: PropTypes.string,
  header: PropTypes.string,
  showFindCCFacilityLink: PropTypes.bool,
};
