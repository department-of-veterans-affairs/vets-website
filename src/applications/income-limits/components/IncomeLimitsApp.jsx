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
  const GENERAL_ERROR =
    'We’re sorry. Something went wrong on our end. Please try again.';

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

  const alertBanner = message => {
    return (
      <va-alert data-testid="il-service-error" status="error" uswds={false}>
        <h2 className="vads-u-margin-bottom--2" slot="headline">
          We&#8217;ve run into a problem
        </h2>
        <p className="vads-u-margin--0">{message}</p>
      </va-alert>
    );
  };

  return (
    <div className="income-limits-app row vads-u-padding-bottom--8">
      {zipValidationError && alertBanner(GENERAL_ERROR)}
      {resultsValidationError &&
        alertBanner(resultsValidationErrorText || GENERAL_ERROR)}
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
