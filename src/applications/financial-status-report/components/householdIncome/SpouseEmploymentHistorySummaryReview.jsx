import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const renderWorkDates = (job, index) => {
  if (!job.isCurrent) {
    return (
      <div className="review-row" key={job.type + index}>
        <dt>Dates</dt>
        <dd>
          {job.from} - {job.to}
        </dd>
      </div>
    );
  }
  return (
    <div className="review-row" key={job.type + index}>
      <dt>Dates</dt>
      <dd>{job.from} - Present</dd>
    </div>
  );
};

const renderGrossMonthlyIncome = (job, index) => {
  if (!job.isCurrent) return null;

  return (
    <div className="review-row" key={job.type + index}>
      <dt>Gross monthly income</dt>
      <dd>{currencyFormatter(job.grossMonthlyIncome)}</dd>
    </div>
  );
};

const renderDeductions = job => {
  if (!job.isCurrent) return null;

  return (
    <>
      {job.deductions.map((deduction, deductionIndex) => {
        return (
          <div className="review-row" key={job.type + deductionIndex}>
            <dt>{deduction.name}</dt>
            <dd>{currencyFormatter(deduction.amount)}</dd>
          </div>
        );
      })}
    </>
  );
};

const renderEmploymentHistory = (job, index) => {
  if (job.isCurrent) {
    return (
      <>
        <dl className="review">{renderWorkDates(job, index)}</dl>
        <dl className="review">{renderGrossMonthlyIncome(job, index)}</dl>
        <dl className="review">{renderDeductions(job)}</dl>
      </>
    );
  }
  return (
    <>
      <dl className="review">{renderWorkDates(job, index)}</dl>
    </>
  );
};

const SpouseEmploymentHistorySummaryReview = ({ data }) => {
  const {
    spEmploymentRecords = [],
  } = data.personalData.employmentHistory.spouse;

  return (
    <>
      {spEmploymentRecords.map((job, index) => {
        return (
          <div
            className="form-review-panel-page"
            key={index + job.amountDueMonthly}
          >
            <div className="form-review-panel-page-header-row">
              <h4 className="vads-u-font-size--h5">
                Spouse’s {job.type} employment at {job.employerName}
              </h4>
            </div>
            <dl>{renderEmploymentHistory(job, index)}</dl>
          </div>
        );
      })}
    </>
  );
};

SpouseEmploymentHistorySummaryReview.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      employmentHistory: PropTypes.shape({
        spouse: PropTypes.shape({
          spEmploymentRecords: PropTypes.array,
        }),
      }),
    }),
  }),
  title: PropTypes.string,
};

export default SpouseEmploymentHistorySummaryReview;
