import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const veteranRecords = recordArray => {
  return (
    <>
      <h4>Other sources of income (Veteran)</h4>
      <dl className="review">
        {recordArray.map((income, index) => {
          return (
            <div
              className="review-row"
              key={income.name + income.amount + index}
            >
              <dt>{income.name}</dt>
              <dd>{currencyFormatter(income.amount)}</dd>
            </div>
          );
        })}
      </dl>
    </>
  );
};

const spouseRecords = spouseRecordArray => {
  if (spouseRecordArray.length === 0) {
    return null;
  }

  return (
    <>
      <h4>Other sources of income (Spouse)</h4>
      <dl className="review">
        {spouseRecordArray.map((income, index) => {
          return (
            <div
              className="review-row"
              key={income.name + income.amount + index}
            >
              <dt>{income.name}</dt>
              <dd>{currencyFormatter(income.amount)}</dd>
            </div>
          );
        })}
      </dl>
    </>
  );
};

const OtherIncomeSummaryReview = ({ data }) => {
  const { addlIncRecords = [] } = data.additionalIncome;
  const { spAddlIncome = [] } = data.additionalIncome.spouse;

  return (
    <div>
      {veteranRecords(addlIncRecords)} <br />
      {spouseRecords(spAddlIncome)}
    </div>
  );
};

OtherIncomeSummaryReview.propTypes = {
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
      spouse: PropTypes.shape({
        spAddlIncome: PropTypes.array,
      }),
    }),
  }),
  title: PropTypes.string,
};

export default OtherIncomeSummaryReview;
