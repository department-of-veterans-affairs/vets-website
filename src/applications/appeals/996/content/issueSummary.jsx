import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import ShowIssuesList from '../../shared/components/ShowIssuesList';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <h3 className="vads-u-margin-top--0">
        You’re requesting a Higher-Level Review for these issues:
      </h3>
      {ShowIssuesList({ issues })}
      <p>
        If an issue is missing, please{' '}
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

SummaryTitle.propTypes = {
  formData: PropTypes.shape({}),
};
