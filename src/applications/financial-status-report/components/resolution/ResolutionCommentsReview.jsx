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
      <dl className="review">
        <div className="review-row" key="resolution-comments">
          <dt className="sr-only">Additional comments</dt>
          <dd className="vads-u-width--full vads-u-padding-left--0 vads-u-text-align--left vads-u-font-weight--normal">
            {additionalData?.additionalComments}
          </dd>
        </div>
      </dl>
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
