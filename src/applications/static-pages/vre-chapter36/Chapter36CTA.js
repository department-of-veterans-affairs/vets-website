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
      <>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              Sign in to your eBenefits account.
            </li>
            <li className="process-step list-two">
              Select <strong>Apply</strong>.
            </li>
            <li className="process-step list-three">
              Click <strong>Veteran Readiness and Employment Program</strong>.
            </li>
            <li className="process-step list-four">
              Apply <strong>for Education and Career Counseling</strong>.
            </li>
            <li className="process-step list-five">
              If you're eligible, we'll invite you to an orientation session at
              your nearest VA regional office.
            </li>
          </ol>
        </div>
        <EbenefitsLink
          path="ebenefits/payments"
          className="usa-button-primary va-button-primary"
        >
          Go to eBenefits to apply
        </EbenefitsLink>
      </>
    );
  } else {
    content = <CallToActionWidget appId="chapter-36-cta" />;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter36],
});

export default connect(mapStateToProps)(Chapter36CTA);
