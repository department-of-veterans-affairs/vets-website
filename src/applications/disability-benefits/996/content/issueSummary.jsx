import React from 'react';
import { Link } from 'react-router';

import formConfig from '../config/form';
import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';

export const SummaryTitle = ({ formData }) => {
  const { pages } = formConfig.chapters.conditions;
  const pathname = formData.hlrV2
    ? pages.contestableIssues.path
    : pages.contestedIssues.path;
  const issues = getSelected(formData);

  return (
    <>
      <p>These are the issues you’re asking to get a Higher-Level Review.</p>
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
