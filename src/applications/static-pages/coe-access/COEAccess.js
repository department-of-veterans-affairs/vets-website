import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const COEAccess = ({ includedInFlipper }) => {
  if (includedInFlipper === undefined) {
    return <va-loading-indicator set-focus message="Loading..." />;
  }

  if (includedInFlipper) {
    return (
      <>
        <p>You can request a COE online right now.</p>
        <a
          className="vads-c-action-link--green"
          href="/housing-assistance/home-loans/request-coe-form-26-1880"
        >
          Request a COE or check COE status
        </a>
      </>
    );
  }

  return (
    <>
      <p>You can request a COE online right now on eBenefits.</p>
      <p>
        When you go to the eBenefits website, you may need to sign in with your
        Premium <strong>DS Logon</strong> account. If you don’t have a Premium
        account, you can register for one there.
      </p>
      <a
        className="vads-c-action-link--green"
        href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=cert-of-eligibility-home-loan"
      >
        Request a COE on eBenefits
      </a>
    </>
  );
};

COEAccess.propTypes = {
  includedInFlipper: PropTypes.bool,
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.coeAccess],
});

export default connect(mapStateToProps)(COEAccess);
