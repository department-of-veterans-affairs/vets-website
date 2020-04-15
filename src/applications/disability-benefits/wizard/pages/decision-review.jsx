import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision on your claim, you can request a
      decision review on all or some of the decision. In most situations, you
      have one year from the date on your decision letter to request a decision
      review. The deadline to file may be different if you have a{' '}
      <a href="/decision-reviews/fiduciary-claims">fiduciary claim</a>, a{' '}
      <a href="/decision-reviews/multiple-party-claims/">contested claim</a>, or
      if you’re filing a{' '}
      <a href="/decision-reviews/#supplemental-claim">Supplemental Claim</a>.
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
