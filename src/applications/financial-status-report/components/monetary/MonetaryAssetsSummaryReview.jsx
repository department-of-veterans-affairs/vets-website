import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { currency as currencyFormatter } from '../../utils/helpers';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const MonetaryAssetsSummaryReview = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  const {
    assets,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { monetaryAssets = [] } = assets;

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    return goToPath('/cash-on-hand');
  };

  return (
    <>
      {showReviewNavigation ? (
        <ReviewPageHeader title="household assets" goToPath={onReviewClick} />
      ) : null}
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
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export default MonetaryAssetsSummaryReview;
