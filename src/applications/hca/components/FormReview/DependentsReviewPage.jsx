import React from 'react';
import PropTypes from 'prop-types';

const DependentsReviewPage = ({ data }) => {
  const { dependents } = data;
  const reviewRows = dependents.map((_item, index) => (
    <div key={index} className="review-row">
      <dt>&nbsp;</dt>
      <dd>&nbsp;</dd>
    </div>
  ));

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Your Dependents
          </h4>
        </div>
        <dl className="review">{reviewRows}</dl>
      </form>
    </div>
  );
};

DependentsReviewPage.propTypes = {
  data: PropTypes.object,
};

export default DependentsReviewPage;
