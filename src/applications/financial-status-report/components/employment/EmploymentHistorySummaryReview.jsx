import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { currency as currencyFormatter } from '../../utils/helpers';

const renderGrossMonthlyIncome = (job, index, isSpouse) => {
  if (!job.isCurrent) return null;

  return (
    <div
      className="review-row"
      key={
        isSpouse
          ? `spouse${index}${job.employerName}${job.type}gmi`
          : `vet${index}${job.employerName}${job.type}gmi`
      }
    >
      <dt>Gross monthly income</dt>
      <dd>{currencyFormatter(job.grossMonthlyIncome)}</dd>
    </div>
  );
};

const renderDeductions = (job, isSpouse) => {
  if (!job.isCurrent) return null;

  return (
    <>
      {job.deductions.map((deduction, deductionIndex) => {
        return (
          <div
            className="review-row"
            key={
              isSpouse
                ? `spouse${deductionIndex}${job.employerName}${
                    job.type
                  }deduction`
                : `vet${deductionIndex}${job.employerName}${job.type}deduction`
            }
          >
            <dt>{deduction.name}</dt>
            <dd>{currencyFormatter(deduction.amount)}</dd>
          </div>
        );
      })}
    </>
  );
};

const formatDate = date => {
  // dates are currently formatted as YYYY-MM-DD
  //  however, we only want to display the month and year and
  //  day is populated with XX which does not play well with formatters
  return moment(new Date(date?.substring(0, 8))).format('MMMM YYYY');
};

const renderWorkDates = (job, index, isSpouse) => {
  const startDate = formatDate(job.from);
  const endDate = job.isCurrent ? 'Present' : formatDate(job.to);

  return (
    <div
      className="review-row"
      key={
        isSpouse
          ? `spouse${index}${job.employerName}${job.type}date`
          : `vet${index}${job.employerName}${job.type}date`
      }
    >
      <dt>Dates</dt>
      <dd>
        {startDate} - {endDate}
      </dd>
    </div>
  );
};

const EmploymentHistorySummaryReview = ({ data, name }) => {
  const { employmentRecords = [] } =
    data?.personalData?.employmentHistory?.veteran ?? [];
  const { spEmploymentRecords = [] } =
    data?.personalData?.employmentHistory?.spouse ?? [];

  const isSpouse = name.toLowerCase().includes('spouse');

  const recordArray = isSpouse ? spEmploymentRecords : employmentRecords;

  return (
    <>
      {recordArray.map((job, index) => {
        return (
          <div
            className="form-review-panel-page"
            key={
              isSpouse
                ? `spouse${index}${job.employerName}${job.type}`
                : `vet${index}${job.employerName}${job.type}`
            }
          >
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                {isSpouse ? "Spouse's " : ''}
                {job.type} employment at {job.employerName}
              </h4>
            </div>
            <dl className="review">
              {renderWorkDates(job, index, isSpouse)}
              {renderGrossMonthlyIncome(job, index, isSpouse)}
              {renderDeductions(job, isSpouse)}
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
  name: PropTypes.string,
};

export default EmploymentHistorySummaryReview;
