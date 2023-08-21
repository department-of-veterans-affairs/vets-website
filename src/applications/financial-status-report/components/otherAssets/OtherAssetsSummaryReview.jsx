import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherAssetsSummaryReview = ({ data, title }) => {
  const { assets } = data;
  const { otherAssets = [] } = assets;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        {otherAssets.map((asset, index) => {
          return (
            <div className="review-row" key={asset.name + asset.amount + index}>
              <dt>{asset.name}</dt>
              <dd>{currencyFormatter(asset.amount)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

OtherAssetsSummaryReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      otherAssets: PropTypes.array,
    }),
  }),
  title: PropTypes.string,
};

export default OtherAssetsSummaryReview;
