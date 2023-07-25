import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherIncomeSummaryReview = ({ data, title }) => {
  const { addlIncRecords = [] } = data.additionalIncome;
  const { spAddlIncome = [] } = data.additionalIncome.spouse;

  const isSpouse = title.toLowerCase().includes('spouse');

  const recordArray = isSpouse ? spAddlIncome : addlIncRecords;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {isSpouse ? 'Spouse’s additional income' : 'Additional income'}
        </h4>
      </div>
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
