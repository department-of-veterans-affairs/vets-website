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
          href="/supporting-forms-for-claims/alternate-signer-form-21-0972"
        >
          Submit a request to sign VA claim forms as an alternate signer
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
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form210972],
});

export default connect(mapStateToProps)(App);
