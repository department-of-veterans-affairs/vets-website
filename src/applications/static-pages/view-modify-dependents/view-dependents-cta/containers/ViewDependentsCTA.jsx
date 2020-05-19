import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const ViewDependentsCTA = props => {
  let content;
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    content = (
      <EbenefitsLink
        path="ebenefits/about/feature?feature=dependent-compensation"
        className="usa-button-primary va-button-primary"
      >
        Go to eBenefits to add or modify a dependent
      </EbenefitsLink>
    );
  } else {
    content = (
      <a
        href="/view-change-dependents/view"
        className="usa-button-primary va-button-primary"
      >
        View your dependents
      </a>
    );
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
