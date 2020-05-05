import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

const Form686ContentReveal = props => {
  let content = <></>;
  if (props.showContent === true) {
    content = (
      <>
        <p className="vads-u-font-size--xl vads-u-font-family--serif vads-u-font-weight--bold">
          How do I add or change a dependent on my VA disability benefits?
        </p>
        <p>
          You could receive additional disability compensation for a spouse,
          child or parent, if you are eligible for VA disability compensation,
          and you have a combined disability rating of at least 30%. Adding a
          dependent may make you eligible to receive a higher compensation
          payment (also called a benefit rate).
        </p>
        <a className="vads-u-display-block">
          Learn about adding dependents to your VA disability benefits
        </a>
        <p className="vads-u-margin-top--1p5">
          To file a claim for additional disability compensation for a child or
          spouse, you can submit an Application Request To Add And/Or Remove
          Dependents (VA Form 21-686c) at the link below. Note that you may need
          to provide more information or forms along with your claim.
        </p>
        <a
          href="/view-change-dependents/add-remove-form-686c"
          className="usa-button"
        >
          Add or change dependents on your VA Benefits
        </a>
      </>
    );
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  user: store.user,
  showContent: toggleValues(store)[FEATURE_FLAG_NAMES.vaViewDependentsAccess],
});

export default connect(mapStateToProps)(Form686ContentReveal);
