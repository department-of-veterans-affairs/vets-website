import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../simple-forms/21p-0537/manifest.json';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  const headerText = 'How do I verify my marital status for my DIC benefits?';
  const pText =
    'If you’re a surviving spouse and need to verify or report changes to your marital status, you’ll need to fill out a Marital Status Questionnaire (VA Form 21P-0537).';
  const dlLink = (
    <va-link
      href="https://www.va.gov/find-forms/about-form-21p-0537/"
      text="Get VA Form 21P-0537 to download"
    />
  );

  if (formEnabled) {
    return (
      <>
        <h2>{headerText}</h2>
        <p>{pText}</p>

        <va-link-action
          href={manifest.rootUrl}
          text="Verify your marital status for DIC benefits"
          type="primary"
        />
        <p>{dlLink}</p>
      </>
    );
  }

  return (
    <>
      <h2>{headerText}</h2>
      <p>{pText}</p>
      <p>{dlLink}</p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form21P0537],
});

export default connect(mapStateToProps)(App);
