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
        <va-link
          href="/supporting-forms-for-claims/request-priority-processing-form-20-10207"
          text="Submit a request online for priority processing for an existing claim"
        />
      </>
    );
  }

  return <p>You can submit this form by mail.</p>;
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form2010207],
});

export default connect(mapStateToProps)(App);
