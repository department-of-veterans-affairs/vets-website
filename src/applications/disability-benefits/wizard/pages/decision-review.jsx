import React from 'react';
import { pageNames } from './pageList';

const DecisionReviewPage = () => (
  <div>
    <h4>You’ll need to request a decision review.</h4>
    <p>
      If you disagree with a VA decision on your claim, you can request a
      decision review on all or some of the decision. You have 1 year from the
      date on your decision to request a review.
    </p>
    <p>
      <a href="/decision-reviews">Find out how to request a decision review</a>
    </p>
  </div>
);

export default {
  name: pageNames.decisionReview,
  component: DecisionReviewPage,
};
