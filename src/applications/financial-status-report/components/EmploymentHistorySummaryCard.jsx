import React from 'react';
import { Link } from 'react-router';

const EmploymentHistorySummaryCard = ({ job, index }) => {
  const employmentCardHeading = `${job.employerName}`;
  const employmentCardSubheading = `From ${job.from} to ${
    job.isCurrent ? 'Now' : job.to
  }`;

  return (
    <article
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
      data-testid="employment-history-item"
    >
      <h3 className="vads-u-margin--0">{employmentCardHeading}</h3>
      <p className="vads-u-margin-y--2 vads-u-font-weight--normal">
        {employmentCardSubheading}
      </p>
      <Link
        className="vads-u-font-size--sm vads-u-font-weight--bold"
        to={{
          pathname: '/enhanced-employment-records',
          search: `?editIndex=${index}`,
        }}
        aria-label="Edit job entry"
      >
        Edit employment at {job.employerName}
        <i
          className="fa fa-chevron-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
};

export default EmploymentHistorySummaryCard;
