import React from 'react';

export default function RealEstateOwnershipValueReview({
  data,
  editPage,
  title,
}) {
  const hasRealEstate = data?.questions?.hasRealEstate;

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
          <dt>Do you currently own any property?</dt>
          <dd>{hasRealEstate ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </div>
  );
}
