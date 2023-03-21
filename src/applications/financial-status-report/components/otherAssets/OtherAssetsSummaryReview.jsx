import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherAssetsSummaryReview = ({ data, title }) => {
  const { assets } = data;
  const { otherAssets = [] } = assets;

  return (
    <div>
      <h4>{title}</h4>
      {otherAssets.map((asset, index) => {
        return (
          <dl className="review" key={asset.name + asset.amount + index}>
            <div className="review-row">
              <dt>{asset.name}</dt>
              <dd>{currencyFormatter(asset.amount)}</dd>
            </div>
          </dl>
        );
      })}
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
