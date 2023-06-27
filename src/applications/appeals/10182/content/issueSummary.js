import React from 'react';
import { Link } from 'react-router';

import { CONTESTABLE_ISSUES_PATH } from '../constants';
import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        These are the issues you’re asking the Board to review.
      </h3>
      {ShowIssuesList({ issues })}
      <p>
        If an issue is missing,{' '}
        <Link
          aria-label="go back and add any missing issues for review"
          to={{
            pathname: CONTESTABLE_ISSUES_PATH,
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
