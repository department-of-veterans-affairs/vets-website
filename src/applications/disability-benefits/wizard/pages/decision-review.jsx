import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';

const DecisionReviewPage = ({ goBack }) => (
  <div>
    Decision review!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: 'decision-review',
  component: DecisionReviewPage,
};
