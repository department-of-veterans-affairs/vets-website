import React from 'react';
import PropTypes from 'prop-types';
import SubmissionCard from './SubmissionCard';

const SubmissionsPageResults = ({ submissions }) => {
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
        return <SubmissionCard submission={submission} key={index} />;
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
};

export default SubmissionsPageResults;
