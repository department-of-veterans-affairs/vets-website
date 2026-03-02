import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return (
    <>
      {formEnabled && (
        <span className="vads-u-display--block">
          <va-link-action
            href="https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/"
            text="Apply for DIC, Survivors Pension, or accrued benefits online"
            type="secondary"
          />
        </span>
      )}
      <span className="vads-u-display--block">
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-534ez"
          text="Get VA Form 21P-534EZ to download"
        />
      </span>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.survivorsBenefitsFormEnabled
  ],
});

export default connect(mapStateToProps)(App);
