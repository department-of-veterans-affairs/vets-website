import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const MonetaryAssetsSummaryReview = ({ data }) => {
  const { monetaryAssets = [] } = data.assets;

  return (
    <>
      <h4>Monetary assets</h4>
      <dl className="review">
        {monetaryAssets.map((income, index) => {
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

MonetaryAssetsSummaryReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
  }),
  title: PropTypes.string,
};

export default MonetaryAssetsSummaryReview;
