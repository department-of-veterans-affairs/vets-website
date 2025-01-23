import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../ivc-champva/10-7959a/manifest.json';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can submit this application online or by mail.</p>
        <a className="vads-c-action-link--blue" href={manifest?.rootUrl}>
          Submit a CHAMPVA Claim Form
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
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959a],
});

export default connect(mapStateToProps)(App);
