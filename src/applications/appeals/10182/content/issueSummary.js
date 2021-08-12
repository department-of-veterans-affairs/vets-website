import React from 'react';

import formConfig from '../config/form';
import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';

export const SummaryTitle = ({ formData }) => {
  const { pages } = formConfig.chapters.conditions;
  const pathname = formData.contestableIssues?.length
    ? pages.contestableIssues.path
    : pages.additionalIssues.path;
  const issues = getSelected(formData);

  return (
    <>
      <p>These are the issues you’re asking the Board to review.</p>
      {ShowIssuesList({ issues })}
      <p>
        If an issue is missing, please{' '}
        <a
          aria-label="go back and add any missing issues for review"
          href={`${pathname}?redirect`}
        >
          go back and add it
        </a>
        .
      </p>
    </>
  );
};
