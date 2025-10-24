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

  return (
    <>
      {/* 534EZ */}
      <h2>If you’re the surviving spouse or child of a Veteran</h2>
      <p>
        You should fill out an Application for DIC, Survivors Pension, and/or
        Accrued Benefits (VA Form 21P-534EZ). You can submit this form by mail.
      </p>

      <va-link
        href="https://www.va.gov/find-forms/about-form-21p-534ez/"
        text="Get VA Form 21P-534EZ to download"
      />

      {/* 535 */}
      <h2>If you’re the surviving parent of a Veteran</h2>
      <p>
        You should fill out an Application for Dependency and Indemnity
        Compensation by Parent(s) (VA Form 21P-535). You submit this form by
        mail.
      </p>

      <va-link
        href="https://www.va.gov/find-forms/about-form-21p-535/"
        text="Get VA Form 21P-535 to download"
      />

      {/* 601 */}
      <h2>If you’re requesting reimbursement for expenses</h2>
      <p>
        You should fill out an Application for Accrued Amounts Due a Deceased
        Beneficiary (VA Form 21P-601). You can submit this form{' '}
        {formEnabled ? 'online or ' : ''}
        by mail.
      </p>

      {formEnabled && (
        <>
          <va-link-action
            href={manifest.rootUrl}
            text="Apply for accrued benefits online"
            type="secondary"
          />
          <br />
        </>
      )}

      <va-link
        href="https://www.va.gov/find-forms/about-form-21p-601/"
        text="Get VA Form 21P-601 to download"
      />
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
