import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

import CallToActionWidget from 'applications/static-pages/cta-widget';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const ViewDependentsCTA = props => {
  let content;
  if (props.includedInFlipper === undefined) {
    content = <va-loading-indicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    content = (
      <EbenefitsLink
        path="ebenefits/about/feature?feature=dependent-compensation"
        className="vads-c-action-link--blue"
      >
        Go to eBenefits to add or modify a dependent
      </EbenefitsLink>
    );
  } else {
    content = <CallToActionWidget appId="view-dependents" />;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  user: store.user,
  includedInFlipper: toggleValues(store)[
    FEATURE_FLAG_NAMES.vaViewDependentsAccess
  ],
});

export default connect(mapStateToProps)(ViewDependentsCTA);
