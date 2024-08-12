import React from 'react';

const CustomTopicReviewField = ({ data }) => {
  return (
    <>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <div>Topic</div>
        <div className="vads-u-font-weight--bold vads-u-margin-right--1">
          {data.selectTopic}
        </div>
      </div>
    </>
  );
};

export default CustomTopicReviewField;
