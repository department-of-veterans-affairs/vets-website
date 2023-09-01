import React from 'react';
import PropTypes from 'prop-types';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const RealEstateQuestionReview = ({ data, goToPath, title }) => {
  const { assets, questions } = data;
  const { monetaryAssets = [] } = assets;

  return (
    <>
      {monetaryAssets.length > 0 ? null : (
        <ReviewPageHeader
          title="household assets"
          goToPath={() => goToPath('/monetary-asset-checklist')}
        />
      )}
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Do you currently own any property?</dt>
            <dd>{questions?.hasRealEstate ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

RealEstateQuestionReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
    questions: PropTypes.shape({
      hasRealEstate: PropTypes.bool,
    }),
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export default RealEstateQuestionReview;
