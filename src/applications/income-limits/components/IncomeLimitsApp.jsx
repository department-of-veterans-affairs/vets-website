import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from './Breadcrumbs';

const IncomeLimitsApp = ({ children, zipValidationError }) => {
  return (
    <div className="income-limits-app row vads-u-padding-bottom--8">
      {zipValidationError && (
        <va-alert data-testid="il-service-error" status="error">
          <h2 className="vads-u-margin-bottom--2" slot="headline">
            We&#8217;ve run into a problem
          </h2>
          <p className="vads-u-margin--0">
            We&#8217;re sorry, something went wrong on our end. Please try
            again.
          </p>
        </va-alert>
      )}
      <Breadcrumbs />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  zipValidationError: state?.incomeLimits?.zipValidationServiceError,
});

IncomeLimitsApp.propTypes = {
  children: PropTypes.any,
  zipValidationError: PropTypes.bool,
};

export default connect(mapStateToProps)(IncomeLimitsApp);
