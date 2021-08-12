import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const COEAccess = props => {
  if (props.includedInFlipper === undefined) {
    return <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper) {
    return (
      <a className="usa-button-primary va-button-primary" href="#">
        Check your eligibility
      </a>
    );
  } else {
    return (
      <a className="usa-button-primary va-button-primary" href="#">
        Go to eBenefits
      </a>
    );
  }
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.coeAccess],
});

export default connect(mapStateToProps)(COEAccess);
