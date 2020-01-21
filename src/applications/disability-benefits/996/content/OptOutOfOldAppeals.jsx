import React from 'react';

export const OptOutTitle = (
  <h3 className="confirmation-page-title">Opt out of the old appeals system</h3>
);

export const OptOutDescription = (
  <p>
    To request a Higher-Level Review, you’ll need to opt out (withdraw) from the
    old appeals process. This switch triggers us to formally withdraw your claim
    or appeal from the old appeal system and process it under the new system.
    Once you opt in to the new appeals process, the decision is permanent and
    you can’t return to the old appeals process.
  </p>
);

export const OptOutCheckboxLabel = (
  <>
    <strong>I choose to opt out of the old appeals process</strong>
    <span className="schemaform-required-span" role="presentation">
      (*Required)
    </span>
  </>
);

export const OptOutCheckboxDescription = (
  <div
    className="vads-u-font-weight--normal vads-u-margin-left--3"
    role="presentation"
  >
    I'm removing my claim and any related hearing requests from the old appeals
    process, and I'm requesting these be reviewed under the new appeals review
    process.
    <br />
    <br />I understand that this decision is permanent and I can't return to the
    old appeals process.
  </div>
);

export const OptOutFooter = () => (
  <>
    <a href="/decision-reviews">Learn more about the review options</a>
    <p>
      <a href="/disability/view-disability-rating/rating">
        See all your contested issues
      </a>
    </p>
  </>
);
