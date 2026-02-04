import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const rootUrl =
  '/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return (
    <>
      {formEnabled ? (
        <>
          <p>You can submit this form online or by mail.</p>
          <va-link-action
            href={rootUrl}
            text="Submit medical expenses to support a pension or DIC claim"
            type="secondary"
          />
        </>
      ) : (
        <p>You can submit this form by mail.</p>
      )}
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.medicalExpenseReportsEnabled
  ],
});

export default connect(mapStateToProps)(App);
