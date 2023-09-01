import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const MonetaryAssetsSummaryReview = ({ data, goToPath }) => {
  const { monetaryAssets = [] } = data.assets;

  return (
    <>
      <ReviewPageHeader
        title="household assets"
        goToPath={() => goToPath('/monetary-asset-checklist')}
      />
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Monetary assets
          </h4>
        </div>
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
      </div>
    </>
  );
};

MonetaryAssetsSummaryReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
  }),
  goToPath: PropTypes.func,
};

export default MonetaryAssetsSummaryReview;
