import React from 'react';

import { getSelected } from '../utils/helpers';
import { getDate } from '../utils/dates';
import { FORMAT_READABLE } from '../constants';

export const OptInDescription = ({ formData }) => {
  // Change this once we figure out which issues are legacy, switch to getLegacyAppeals
  const issues = getSelected(formData); // getLegacyAppeals(formData);
  return (
    <div id="opt-in-description">
      The issue(s) listed here may be in our old appeals process:
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>
            <strong className="capitalize">
              {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
            </strong>
            <div>
              Decision date:{' '}
              {getDate({
                date:
                  issue.attributes?.approxDecisionDate ||
                  issue.decisionDate ||
                  '',
                pattern: FORMAT_READABLE,
              })}
            </div>
          </li>
        ))}
      </ul>
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
