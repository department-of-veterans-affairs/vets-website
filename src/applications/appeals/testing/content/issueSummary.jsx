import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';
import ShowIssuesList from '../../shared/components/ShowIssuesList';

export const SummaryTitle = ({ formData }) => {
  const issues = formData.areaOfDisagreement;

  return (
    <>
      <h1 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        These are the issues you’re asking the Board to review.
      </h1>
      {ShowIssuesList({ issues })}
      <p>
        <Link
          aria-label="go back and add any missing issues for review"
          to={`/${CONTESTABLE_ISSUES_PATH}`}
        >
          Add an issue
        </Link>
      </p>
    </>
  );
};

SummaryTitle.propTypes = {
  formData: PropTypes.shape({
    areaOfDisagreement: PropTypes.array,
  }),
};
