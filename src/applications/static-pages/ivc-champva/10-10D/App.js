import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can submit this application online or by mail.</p>
        <a
          className="vads-c-action-link--blue"
          href="/family-and-caregiver-benefits/health-and-disability/champva/apply-form-10-10d"
        >
          Submit an application online to enroll in CHAMPVA benefits
        </a>
      </>
    );
  }

  return (
    <>
      <p>You can submit this application by mail.</p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form1010d],
});

export default connect(mapStateToProps)(App);
