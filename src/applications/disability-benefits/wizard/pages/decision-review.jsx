import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './pageList';

const DecisionReviewPage = ({ goBack }) => (
  <div>
    Decision review!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: pageNames.decisionReview,
  component: DecisionReviewPage,
};
