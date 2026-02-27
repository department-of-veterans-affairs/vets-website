import React from 'react';
import { PropTypes, defaultProps } from 'prop-types';
import SubmissionCard from './SubmissionCard';

const SubmissionsPageResults = ({ submissions, omitClaimantName }) => {
  if (!submissions || submissions.length === 0) {
    return (
      <p data-testid="submissions-table-fetcher-empty">
        No form submissions found
      </p>
    );
  }

  return (
    <ul
      data-testid="submissions-card"
      className="submissions__list"
      sort-column={1}
    >
      {submissions.map((submission, index) => {
        return (
          <SubmissionCard
            submission={submission} key={index} omitClaimantName={omitClaimantName}
          />
        );
      })}
    </ul>
  );
};

SubmissionsPageResults.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func,
    }),
  ),
  omitClaimantName: PropTypes.bool,
};

SubmissionsPageResults.defaultProps = {
  omitClaimantName: false,
};

export default SubmissionsPageResults;
