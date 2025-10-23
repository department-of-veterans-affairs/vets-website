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
        <p>You can submit this form online or by mail.</p>
        <a
          className="vads-c-action-link--blue"
          href="/supporting-forms-for-claims/lay-witness-statement-form-21-10210"
        >
          Submit a lay witness statement online to support a claim
        </a>
      </>
    );
  }

  return <p>You can submit this form by mail.</p>;
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form2110210],
});

export default connect(mapStateToProps)(App);
