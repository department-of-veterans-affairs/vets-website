import React from 'react';

// import { getSelected } from '../utils/helpers';
// import { ShowIssuesList } from '../components/ShowIssuesList';

export const OptInDescription = () => {
  // Change this once we figure out which issues are legacy, switch to getLegacyAppeals
  // const issues = getSelected(formData); // getLegacyAppeals(formData);
  return (
    <div id="opt-in-description">
      {/* Legacy issues hidden until future implementation */}
      {/* The issue(s) listed here may be in our old appeals process:
      {ShowIssuesList({ issues })} */}
      <p>
        If you’re requesting a Board Appeal on an issue in an initial claim we
        decided before February 19, 2019, you’ll need to opt in to the new
        decision review process. To do this, please check the box here. We’ll
        move your issue from the old appeals process to the new decision review
        process.
      </p>
      <p>
        Our decision review process is part of the Appeals Modernization Act.
        When you opt in, you’re likely to get a faster decision.
      </p>
    </div>
  );
};

export const OptInLabel = (
  <strong className="opt-in-title">
    I understand that if I want any issues reviewed that are currently in the
    old appeals process, I’m opting them in to the new decision review process.
  </strong>
);

// children should always be "True"
export const OptInReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{OptInLabel}</dt>
    <dd>{children}</dd>
  </div>
);

export const optInErrorMessage =
  'Please opt in to the new decision review process to proceed';
