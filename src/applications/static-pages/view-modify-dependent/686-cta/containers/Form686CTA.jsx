import React from 'react';
import { connect } from 'react-redux';

import CallToActionWidget from 'applications/static-pages/cta-widget';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

const Form686CTA = props => {
  let content;
  if (props.showContent === undefined) {
    content = <va-loading-indicator message="Loading..." />;
  } else if (props.showContent === false) {
    content = (
      <EbenefitsLink
        path="ebenefits/about/feature?feature=dependent-compensation"
        className="usa-button"
      >
        Go to eBenefits to add or modify a dependent
      </EbenefitsLink>
    );
  } else {
    content = <CallToActionWidget appId="add-remove-dependents" />;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  user: store.user,
  showContent: toggleValues(store)[FEATURE_FLAG_NAMES.vaViewDependentsAccess],
});

export default connect(mapStateToProps)(Form686CTA);
