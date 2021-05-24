import React from 'react';

// import { getSelected } from '../utils/helpers';
// import { ShowIssuesList } from '../components/ShowIssuesList';

export const OptInDescription = () => {
  // Hidden until future implementing of legacy issues
  // Change this once we figure out which issues are legacy, switch to getLegacyAppeals
  // const issues = getSelected(formData); // getLegacyAppeals(formData);
  return (
    <div id="opt-in-description">
      {/* The issue(s) listed here may be in our old appeals process:
      {ShowIssuesList({ issues })} */}
      <p>
        If you’re requesting a Board Appeal on an issue in an older claim,
        you’ll need to opt in to the new decision review process by checking the
        box. This moves your issue out of the old appeals process. As part of
        the Appeals Modernization Act, our new process means you’ll likely get a
        faster decision.
      </p>
    </div>
  );
};

export const OptInLabel = (
  <strong className="opt-in-title">
    I understand that I’m opting in to the new decision review process any
    issues I’d like reviewed that are part of a claim VA decided before February
    19, 2019.
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
  'Please opt into the new decision review process to proceed';
