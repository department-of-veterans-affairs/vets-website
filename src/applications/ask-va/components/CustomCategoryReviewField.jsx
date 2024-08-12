import React from 'react';

const CustomCategoryReviewField = ({ data }) => {
  return (
    <>
      <h5 className="vads-u-padding-y--1">Category and topic</h5>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <div>Category</div>
        <div className="vads-u-font-weight--bold vads-u-margin-right--1">
          {data.selectCategory}
        </div>
      </div>
    </>
  );
};

export default CustomCategoryReviewField;
