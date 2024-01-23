import React from 'react';
import PropTypes from 'prop-types';

const ResolutionCommentsReview = ({ data }) => {
  const { additionalData } = data;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Personal statement
        </h4>
      </div>
      <div className="review">
        <div className="review-row" key="resolution-comments">
          {additionalData?.additionalComments}
        </div>
      </div>
    </div>
  );
};

ResolutionCommentsReview.propTypes = {
  data: PropTypes.shape({
    additionalData: PropTypes.shape({
      additionalComments: PropTypes.string,
    }),
  }),
};

export default ResolutionCommentsReview;
