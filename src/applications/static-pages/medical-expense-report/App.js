import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const rootUrl =
  '/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416';
const headerText =
  'Submit medical expenses to support a pension or DIC claim (VA Form 21P-8416)';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return (
    <>
      <h2>{headerText}</h2>
      <h3>When to use this form</h3>
      <p>
        Use this form to report medical or dental expenses that you have paid
        for yourself or for a family member living in your household. These must
        be expenses you weren’t reimbursed for and don’t expect to be reimbursed
        for.
      </p>
      <h3>How to submit this form</h3>
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
