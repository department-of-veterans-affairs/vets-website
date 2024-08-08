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
          href="/health-care/foreign-medical-program/register-form-10-7959f-1"
        >
          Submit an application online to register for the Foreign Medical
          Program (FMP)
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
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959F1],
});

export default connect(mapStateToProps)(App);
