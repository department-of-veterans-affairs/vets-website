import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import ShowIssuesList from '../../shared/components/ShowIssuesList';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        These are the issues you’re asking the Board to review.
      </h3>
      {ShowIssuesList({ issues })}
      <p>
        <Link
          to={{
            pathname: CONTESTABLE_ISSUES_PATH,
            search: '?redirect',
          }}
        >
          Go back to add more issues
        </Link>
      </p>
    </>
  );
};

SummaryTitle.propTypes = {
  formData: PropTypes.shape({}),
};
