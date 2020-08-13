import React, { useEffect, useState } from 'react';

export const VeteranInformationReviewDescription = props => {
  const [editBtns, setEditBtns] = useState([]);
  useEffect(
    () => {
      if (props.reviewPageView.includes('veteranInformation')) {
        const editBtn = document.querySelectorAll('.edit-btn.primary-outline');
        setEditBtns(Array.from(editBtn));
      }
    },
    [props.reviewPageView],
  );
  useEffect(
    () => {
      // eslint-disable-next-line no-unused-expressions
      editBtns[0]?.classList.add('edit-btn-hidden');
    },
    [editBtns],
  );
  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h3 className="form-review-panel-page-header vads-u-font-size--h5">
          Veteran Information
        </h3>
      </div>
      <dl className="review">
        <dt>Name</dt>
        <dd>Test Name</dd>
      </dl>
    </>
  );
};
