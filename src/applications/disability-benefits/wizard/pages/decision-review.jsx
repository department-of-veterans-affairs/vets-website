import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision on your claim, you can request a
      decision review on all or some of the decision. You have 1 year from the
      date on your decision to request a review.
    </p>
    <p>
      <a href="/decision-reviews">Find out how to request a decision review</a>
    </p>
  </>
);

const DecisionReviewPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to request a decision review"
    content={alertContent}
  />
);

export default {
  name: pageNames.decisionReview,
  component: DecisionReviewPage,
};
