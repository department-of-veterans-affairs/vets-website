import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherAssetsSummaryReview = ({ data, title }) => {
  const { assets } = data;
  const { otherAssets = [] } = assets;

  return (
    <div>
      <h4>{title}</h4>
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
