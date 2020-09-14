import React from 'react';

import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import CallToActionWidget from 'platform/site-wide/cta-widget';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const Chapter36CTA = props => {
  let content;
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    content = (
      <EbenefitsLink
        path="ebenefits/payments"
        className="usa-button-primary va-button-primary"
      >
        Go to eBenefits to view your VA payment history
      </EbenefitsLink>
    );
  } else {
    content = <CallToActionWidget appId="chapter-36-cta" />;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.chapter36Access],
});

export default connect(mapStateToProps)(Chapter36CTA);
