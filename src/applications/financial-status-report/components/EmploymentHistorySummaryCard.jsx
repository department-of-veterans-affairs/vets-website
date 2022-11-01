import React from 'react';

const EmploymentHistorySummaryCard = ({ job }) => {
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

      {/* <div className="vads-u-margin-right--5 vads-u-margin-top--2 vads-u-font-weight--bold">
        <Link
          data-testid="debt-details-button"
          onClick={() => {
            recordEvent({ event: 'cta-link-click-debt-summary-card' });
            setActiveDebt(debt);
          }}
          to={`/debt-balances/details/${debt.fileNumber + debt.deductionCode}`}
          aria-label={`Check details and resolve this ${employmentCardHeading}`}
        >
          Check details and resolve this debt
          <i
            aria-hidden="true"
            className="fa fa-chevron-right vads-u-font-size--sm vads-u-margin-left--0p5"
          />
        </Link>
      </div> */}
    </article>
  );
};

export default EmploymentHistorySummaryCard;
