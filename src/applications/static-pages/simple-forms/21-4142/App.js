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
        <p>You can start your authorization right now.</p>
        <a
          className="vads-c-action-link--green"
          href="/supporting-forms-for-claims/release-records-to-va-form-21-4142"
        >
          Authorize the release of non-VA medical information to VA
        </a>
      </>
    );
  }

  return (
    <>
      <h1>We’re still working on this feature</h1>
      <p>
        We’re rolling out the Authorization to the release non-VA medical
        information to VA (VA Form 21-4142 and 21-4142a) in stages. It’s not
        quite ready yet. Please check back again soon.
      </p>
      <a className="vads-c-action-link--green" href="/">
        Return to VA home page
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
