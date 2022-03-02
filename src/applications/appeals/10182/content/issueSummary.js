import React from 'react';
import { Link } from 'react-router';

import { contestableIssuesPath } from '../constants';
import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <p className="vads-u-margin-top--0">
        These are the issues you’re asking the Board to review.
      </p>
      {ShowIssuesList({ issues })}
      <p>
        If an issue is missing, please{' '}
        <Link
          aria-label="go back and add any missing issues for review"
          to={{
            pathname: contestableIssuesPath,
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
