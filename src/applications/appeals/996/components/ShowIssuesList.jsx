import React from 'react';

import { FORMAT_READABLE } from '../../shared/constants';
import { getDate } from '../../shared/utils/dates';

export const ShowIssuesList = ({ issues }) => (
  <ul>
    {issues.map((issue, index) => (
      <li key={index}>
        <strong className="capitalize dd-privacy-hidden">
          {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
        </strong>
        <div>
          Decision date:{' '}
          <span className="dd-privacy-hidden">
            {getDate({
              date:
                issue.attributes?.approxDecisionDate ||
                issue.decisionDate ||
                '',
              pattern: FORMAT_READABLE,
            })}
          </span>
        </div>
      </li>
    ))}
  </ul>
);
