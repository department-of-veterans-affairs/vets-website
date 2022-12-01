import React from 'react';
import { browserHistory } from 'react-router';
import { setJobIndex } from '../utils/session';

const EmploymentHistorySummaryCard = ({ job, index }) => {
  const employmentCardHeading = `${job.employerName}`;
  const employmentCardSubheading = `From ${job.from} to ${
    job.isCurrent ? 'Now' : job.to
  }`;

  const handleClick = () => {
    setJobIndex(index);
    browserHistory.push(`/enhanced-employment-records`);
  };

  return (
    <article
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
      data-testid="employment-history-item"
    >
      <h3 className="vads-u-margin--0">{employmentCardHeading}</h3>
      <p className="vads-u-margin-y--2 vads-u-font-weight--normal">
        {employmentCardSubheading}
      </p>
      <a
        onClick={() => {
          handleClick();
        }}
        href="#/edit"
      >
        Edit
      </a>
    </article>
  );
};

export default EmploymentHistorySummaryCard;
