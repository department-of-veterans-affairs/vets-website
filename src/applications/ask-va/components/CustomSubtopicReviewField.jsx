import React from 'react';

const CustomSubtopicReviewField = ({ data }) => {
  return (
    <>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <div>Subtopic</div>
        <div className="vads-u-font-weight--bold vads-u-margin-right--1">
          {data.selectSubtopic}
        </div>
      </div>
    </>
  );
};

export default CustomSubtopicReviewField;
