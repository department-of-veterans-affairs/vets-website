import React from 'react';
import { Link } from 'react-router';

import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';
import { contestableIssuesPath, contestedIssuesPath } from '../constants';

export const SummaryTitle = ({ formData }) => {
  const pathname = formData.hlrV2 ? contestableIssuesPath : contestedIssuesPath;
  const issues = getSelected(formData);

  return (
    <>
      <p className="vads-u-margin-top--0">
        These are the issues you’re asking to get a Higher-Level Review.
      </p>
      {ShowIssuesList({ issues })}
      <p>
        If an issue is missing, please{' '}
        <Link
          aria-label="go back and add any missing issues for review"
          to={{
            pathname,
            search: '?redirect',
          }}
        >
          go back and add it
        </Link>
        .
      </p>
    </>
  );
};
