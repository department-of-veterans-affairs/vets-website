import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { getSelected } from '../utils/helpers';
import { ShowIssuesList } from '../components/ShowIssuesList';
import { CONTESTABLE_ISSUES_PATH } from '../constants';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <p className="vads-u-margin-top--0">
        These are the issues you’re asking to get a Supplemental Claim.
      </p>
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
