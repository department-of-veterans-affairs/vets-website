import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

const Form686CTA = props => {
  let content;
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === true) {
    content = (
      <>
        <p>How do I add or change a dependent on my VA disability benenfits?</p>
        <p>
          You could receive additional disability compensation for a spouse,
          child or parent, if you are eligible for VA disability compensation,
          and you have a combined disability rating of at least 30%. Adding a
          dependent may make you eligible to receive a higher compensation
          payment (also called a benefit rate).
        </p>
        <a className="vads-u-margin-bottom--1p5">
          Learn about adding dependents to your VA disability benefits
        </a>
        <p>
          To file a claim for additional disability compensation for a child or
          spouse, you can submit an Application Request To Add And/Or Remove
          Dependents (VA Form 21-686c) at the link below. Note that you may need
          to provide more information or forms along with your claim.
        </p>
      </>
    );
  } else {
    content = (
      <>
        <p>How do I add or change a dependent on my VA disability benenfits?</p>
        <p>
          You could receive additional disability compensation for a spouse,
          child or parent, if you are eligible for VA disability compensation,
          and you have a combined disability rating of at least 30%. Adding a
          dependent may make you eligible to receive a higher compensation
          payment (also called a benefit rate).
          <a>Learn about adding dependents to your VA disability benefits</a>
        </p>
        <p>
          To file a claim for additional disability compensation for a child or
          spouse, you can submit an Application Request To Add And/Or Remove
          Dependents (VA Form 21-686c) at the link below. Note that you may need
          to provide more information or forms along with your claim.
        </p>
      </>
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

export default connect(mapStateToProps)(Form686CTA);
