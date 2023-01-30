import React from 'react';

export default function RealEstateOwnershipValueReview({
  data,
  editPage,
  title,
}) {
  const realEstateValue = data?.realEstateValue;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <button
          aria-label={`Edit ${title}`}
          className="edit-btn primary-outline"
          onClick={editPage}
          type="button"
        >
          Edit
        </button>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>What is the estimated value of your property?</dt>
          <dd>{realEstateValue}</dd>
        </div>
      </dl>
    </div>
  );
}
