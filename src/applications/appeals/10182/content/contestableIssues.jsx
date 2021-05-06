import React from 'react';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const EligibleIssuesTitle = ({ formData } = {}) =>
  formData?.contestableIssues?.length === 0 ? (
    <h2
      className="section-title vads-u-font-size--h4 vads-u-margin-top--2"
      name="eligibleScrollElement"
    >
      Sorry, we couldn’t find any eligible issues
    </h2>
  ) : (
    <legend
      name="eligibleScrollElement"
      className="section-title vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--2"
    >
      Please select the issue(s) you’d like us to review:
    </legend>
  );

// The EligibleIssuesTitle is first so screenreaders read it first, but visually
// it is last to match the design (managed by CSS order)
export const EligibleIssuesDescription = props => (
  <>
    <EligibleIssuesTitle {...props} />
    <div>
      These issues are in your VA record. If an issue is missing from this list,
      you can add it manually on the next page.
    </div>
  </>
);

export const NotListedInfo = (
  <div>
    <p className="vads-u-margin-top--0">
      If you don’t see your issue or decision listed here, it may not be in our
      system yet. This can happen if it’s a more recent claim decision. We may
      still be processing it.
    </p>
    <p className="vads-u-margin-bottom--0">
      If you’d like to add an unlisted issue for review, click continue to add
      it on the next page.
    </p>
  </div>
);
