import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const UtilityBillSummaryReview = ({ data, title }) => {
  const { utilityRecords = [] } = data;

  return (
    <div>
      <h4>{title}</h4>
      {utilityRecords.map((utility, index) => {
        return (
          <dl className="review" key={utility.name + utility.amount + index}>
            <div className="review-row">
              <dt>{utility.name}</dt>
              <dd>{currencyFormatter(utility.amount)}</dd>
            </div>
          </dl>
        );
      })}
    </div>
  );
};

UtilityBillSummaryReview.propTypes = {
  data: PropTypes.shape({
    utilityRecords: PropTypes.array,
  }),
  title: PropTypes.string,
};

export default UtilityBillSummaryReview;
