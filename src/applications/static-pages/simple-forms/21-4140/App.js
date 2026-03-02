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
        <p>You can verify this information online or by mail.</p>
        <h4>Option 1: Online</h4>
        <a
          className="vads-c-action-link--blue"
          href="/disability/verify-individual-unemployability-status/submit-employment-questionnaire-form-21-4140"
        >
          Submit Employment Questionnaire
        </a>
        <h4>Option 2: By mail</h4>
      </>
    );
  }

  return (
    <>
      <p>You can submit this form by mail.</p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form214140],
});

export default connect(mapStateToProps)(App);
