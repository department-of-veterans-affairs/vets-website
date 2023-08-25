import React from 'react';
import { getDate } from '../utils/dates';
import { FORMAT_READABLE } from '../../shared/constants';

export const ShowIssuesList = ({ issues }) => (
  <ul>
    {issues.map((issue, index) => (
      <li key={index}>
        <strong className="capitalize dd-privacy-hidden">
          {issue.attributes?.ratingIssueSubjectText || issue.issue || ''}
        </strong>
        <div>
          Decision date:{' '}
          {getDate({
            date:
              issue.attributes?.approxDecisionDate || issue.decisionDate || '',
            pattern: FORMAT_READABLE,
          })}
        </div>
      </li>
    ))}
  </ul>
);
