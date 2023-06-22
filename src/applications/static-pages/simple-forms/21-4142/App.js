import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator set-focus message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can submit this form online or by mail.</p>
        <a
          className="vads-c-action-link--blue"
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142"
        >
          Submit an authorization to release medical information online
        </a>
        <a
          className="vads-c-action-link--green"
          href="/find-forms/about-form-21-4142/"
        >
          Get VA Form 21-4142 to download
        </a>
      </>
    );
  }

  return (
    <>
      <p>You can submit this form by mail.</p>
      <a
        className="vads-c-action-link--green"
        href="/find-forms/about-form-21-4142/"
      >
        Get VA Form 21-4142 to download
      </a>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form214142],
});

export default connect(mapStateToProps)(App);
