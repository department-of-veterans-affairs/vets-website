import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from './Breadcrumbs';
import {
  updateResultsValidationServiceError,
  updateZipValidationServiceError,
} from '../actions';
import { ROUTES } from '../constants';

const IncomeLimitsApp = ({
  children,
  resultsValidationError,
  resultsValidationErrorText,
  router,
  updateResultsServiceError,
  updateZipValError,
  zipValidationError,
}) => {
  const location = router?.getCurrentLocation()?.pathname;
  const GENERAL_ERROR_HEADING = `Your answer didn’t go through.`;
  const GENERAL_ERROR_BODY =
    'We’re sorry. There’s a problem with our system. Refresh this page or try again later.';

  useEffect(
    () => {
      if (zipValidationError && location !== `/${ROUTES.ZIPCODE}`) {
        updateZipValError(false);
      }

      if (resultsValidationError && location !== `/${ROUTES.REVIEW}`) {
        updateResultsServiceError(false);
      }
    },
    [
      location,
      resultsValidationError,
      updateResultsServiceError,
      updateZipValError,
      zipValidationError,
    ],
  );

  const alertBanner = (message = null) => {
    return (
      <va-alert data-testid="il-service-error" status="error" uswds>
        <h2 className="vads-u-margin-bottom--2" slot="headline">
          {message ? `We've run into a problem` : GENERAL_ERROR_HEADING}
        </h2>
        <p className="vads-u-margin--0">{message || GENERAL_ERROR_BODY}</p>
      </va-alert>
    );
  };

  return (
    <div className="income-limits-app row vads-u-padding-bottom--8">
      {zipValidationError && alertBanner()}
      {resultsValidationError && alertBanner(resultsValidationErrorText)}
      <Breadcrumbs />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
};

const mapDispatchToProps = {
  updateResultsServiceError: updateResultsValidationServiceError,
  updateZipValError: updateZipValidationServiceError,
};

const mapStateToProps = state => ({
  resultsValidationError: state?.incomeLimits?.resultsValidationServiceError,
  resultsValidationErrorText: state?.incomeLimits?.resultsValidationErrorText,
  zipValidationError: state?.incomeLimits?.zipValidationServiceError,
});

IncomeLimitsApp.propTypes = {
  router: PropTypes.shape({
    getCurrentLocation: PropTypes.func,
  }).isRequired,
  children: PropTypes.any,
  resultsValidationError: PropTypes.bool,
  resultsValidationErrorText: PropTypes.string,
  updateResultsServiceError: PropTypes.func,
  updateZipValError: PropTypes.func,
  zipValidationError: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IncomeLimitsApp);
