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

const EmploymentHistorySummaryReview = ({ data, title }) => {
  const {
    employmentRecords = [],
  } = data.personalData.employmentHistory.veteran;
  const {
    spEmploymentRecords = [],
  } = data.personalData.employmentHistory.spouse;

  const isSpouse = title.toLowerCase().includes('spouse');

  const recordArray = isSpouse ? spEmploymentRecords : employmentRecords;

  return (
    <>
      {recordArray.map((job, index) => {
        return (
          <div
            className="form-review-panel-page"
            key={index + job.employerName}
          >
            <div className="form-review-panel-page-header-row">
              <h4 className="vads-u-font-size--h5">
                {job.type} at {job.employerName}
              </h4>
            </div>
            <dl className="review">
              {renderWorkDates(job, index)}
              {renderGrossMonthlyIncome(job, index)}
              {renderDeductions(job)}
            </dl>
          </div>
        );
      })}
    </>
  );
};

EmploymentHistorySummaryReview.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      employmentHistory: PropTypes.shape({
        veteran: PropTypes.shape({
          employmentRecords: PropTypes.array,
        }),
        spouse: PropTypes.shape({
          spEmploymentRecords: PropTypes.array,
        }),
      }),
    }),
  }),
  title: PropTypes.string,
};

export default EmploymentHistorySummaryReview;
