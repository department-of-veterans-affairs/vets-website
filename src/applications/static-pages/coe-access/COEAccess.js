import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const COEAccess = props => {
  if (props.includedInFlipper === undefined) {
    return <va-loading-indicator set-focus message="Loading..." />;
  }
  if (props.includedInFlipper) {
    return (
      <a
        className="vads-c-action-link--green"
        href="/housing-assistance/home-loans/check-coe-status/your-coe"
      >
        Check your eligibility
      </a>
    );
  }
  // TODO; Update href destination
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <a className="vads-c-action-link--green" href="#">
      Go to eBenefits
    </a>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
};

COEAccess.propTypes = {
  includedInFlipper: PropTypes.bool,
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.coeAccess],
});

export default connect(mapStateToProps)(COEAccess);
