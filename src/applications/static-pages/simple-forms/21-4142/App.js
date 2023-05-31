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
        <p>You can apply online right now.</p>
        <a
          className="vads-c-action-link--green"
          href="/supporting-forms-for-claims/release-records-to-va-form-21-4142"
        >
          Apply for an Authorization to Disclose Information to the department
          of VA
        </a>
      </>
    );
  }

  return (
    <>
      <p>You can apply online right now on eBenefits.</p>
      <p>
        When you go to the eBenefits website, you may need to sign in with your{' '}
        <strong>DS Logon</strong> account to access the application. If you
        don’t have a <strong>DS Logon</strong> account, you can register for one
        there.
      </p>
      <a
        className="vads-c-action-link--green"
        href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=sah-grant"
      >
        Apply now on eBenefits
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
