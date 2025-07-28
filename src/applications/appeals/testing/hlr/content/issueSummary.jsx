import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ShowIssuesList from '../../../shared/components/ShowIssuesList';

import { CONTESTABLE_ISSUES_PATH } from '../../../shared/constants';
import { getSelected } from '../../../shared/utils/issues';

export const SummaryTitle = ({ formData }) => {
  const issues = getSelected(formData);

  return (
    <>
      <h3 className="vads-u-margin-top--0">
        You’re requesting a Higher-Level Review for these issues:
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
