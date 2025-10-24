import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../simple-forms/21P-601/manifest.json';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  const headerText = 'If you’re requesting reimbursement for expenses';
  const dlLink = (
    <va-link
      href="https://www.va.gov/find-forms/about-form-21p-601/"
      text="Get VA Form 21P-601 to download"
    />
  );

  if (formEnabled) {
    return (
      <>
        <h2>{headerText}</h2>
        <p>
          You should fill out an Application for Accrued Amounts Due a Deceased
          Beneficiary (VA Form 21P-601). You can submit this form online or by
          mail.
        </p>

        <va-link-action
          href={manifest.rootUrl}
          text="Apply for accrued benefits online"
          type="secondary"
        />
        {dlLink}
      </>
    );
  }

  return (
    <>
      <h2>{headerText}</h2>
      <p>
        You should fill out an Application for Accrued Amounts Due a Deceased
        Beneficiary (VA Form 21P-601). You can submit this form by mail.
      </p>
      {dlLink}
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form21P601],
});

export default connect(mapStateToProps)(App);
